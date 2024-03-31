import os
import requests
import numpy as np
import cv2
from scipy.signal import butter, lfilter
import scipy.fftpack as fftpack

sio=None


    
def RGB2YIQ(video):
    '''
    Converts the video color from RGB to YIQ (NTSC)
    :param video: RGB video sequence
    :return: YIQ-color video sequence
    '''
    yiq_from_rgb = np.array([[0.299, 0.587, 0.114], [0.596, -0.274, -0.322], [0.211, -0.523, 0.312]])
    t = np.dot(video, yiq_from_rgb.T)
    return t

def YIQ2RGB(video):
    '''
    Converts the video color from YIQ (NTSC) to RGB
    :param video: YIQ-color video sequence
    :return: RGB video sequence
    '''
    rgb_from_yiq = np.array([[1, 0.956, 0.621], [1, -0.272, -0.647], [1, -1.106, 1.703]])
    t = np.dot(video, rgb_from_yiq.T)
    return t

def download_video_from_url(url):
    output_path = os.path.join(os.getcwd(), 'video.mp4')
    response = requests.get(url, stream=True)
    with open(output_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=1024):
            if chunk:
                f.write(chunk)
    return output_path

def load_video(vidFile):
    '''
    Reads the video
    :param vidFile: Video file
    :return: video sequence, frame rate, width & height of video frames
    '''
    
    print('Loading Video')
    sio.emit(event='messages', data={'logs': 'Loading Video','type':'info'})
    vid = cv2.VideoCapture(vidFile)
    fr = vid.get(cv2.CAP_PROP_FPS)  # frame rate
    len = int(vid.get(cv2.CAP_PROP_FRAME_COUNT))
    vidWidth = int(vid.get(cv2.CAP_PROP_FRAME_WIDTH))
    vidHeight = int(vid.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # save video as stack of images
    video_stack = np.empty((len, vidHeight, vidWidth, 3))

    for x in range(len):
        ret, frame = vid.read()

        video_stack[x] = frame

    vid.release()

    return video_stack, fr, vidWidth, vidHeight

def save_video(video_tensor, fps, name):
    '''
    Creates a new video for the output
    :param video_tensor: filtered video sequence
    :param fps: frame rate of original video
    :param name: output video name
    '''
    print('Saving Video')
    sio.emit(event='messages', data={'logs': 'Saving Video','type':'info'})
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')  # Use 'mp4v' fourcc for MP4 format
    [height, width] = video_tensor[0].shape[0:2]
    writer = cv2.VideoWriter(name + "Eulerian_Magnification.mp4", fourcc, fps, (width, height), True)  # Use .mp4 extension in the output file name
    for i in range(video_tensor.shape[0]):
        writer.write(cv2.convertScaleAbs(video_tensor[i]))
    writer.release()
    return name


def create_gaussian_pyramid(image, levels):
    '''
    Creates a Gaussian pyramid for each image.
    :param image: An image, i.e video frame
    :param levels: The Gaussian pyramid level
    :return: Returns a pyramid of nr. levels images
    '''
    gauss = image.copy()
    gauss_pyr = [gauss]

    for level in range(1, levels):
        gauss = cv2.pyrDown(gauss)
        gauss_pyr.append(gauss)

    return gauss_pyr

def gaussian_video(video_tensor, levels):
    '''
    For a given video sequence the function creates a video with
    the highest (specified by levels) Gaussian pyramid level
    :param video_tensor: Video sequence
    :param levels: Specifies the Gaussian pyramid levels
    :return: a video sequence where each frame is the downsampled of the original frame
    '''
    for i in range(0, video_tensor.shape[0]):
        frame = video_tensor[i]
        pyr = create_gaussian_pyramid(frame, levels)
        gaussian_frame = pyr[-1]  # use only highest gaussian level
        if i == 0:  # initialize one time
            vid_data = np.zeros((video_tensor.shape[0], gaussian_frame.shape[0], gaussian_frame.shape[1], 3))

        vid_data[i] = gaussian_frame
    return vid_data

def create_laplacian_pyramid(image, levels):
    '''
    Builds a Laplace pyramid for an image, i.e. video frame
    :param image: Image,  i.e. single video frame
    :param levels: Specifies the Laplace pyramid levels
    :return: Returns a pyramid of nr. levels images
    '''
    gauss_pyramid = create_gaussian_pyramid(image, levels)
    laplace_pyramid = []
    for i in range(levels-1):
        size = (gauss_pyramid[i].shape[1], gauss_pyramid[i].shape[0])  # reshape
        laplace_pyramid.append(gauss_pyramid[i]-cv2.pyrUp(gauss_pyramid[i+1], dstsize=size))

    laplace_pyramid.append(gauss_pyramid[-1])  # add last gauss pyramid level
    return laplace_pyramid

def laplacian_video_pyramid(video_stack, levels):
    '''
    Creates a Laplacian pyramid for the whole video sequence
    :param video_stack: Video sequence
    :param levels: Specifies the Laplace pyramid levels
    :return: A two-dimensional array where the first index is used for the pyramid levels
    and the second for each video frame
    '''
    print('Building Laplace Pyramid')
    sio.emit(event='messages', data={'logs': 'Building Laplace Pyramid','type':'info'})

    # "2 dimensional" array - first index for pyramid level, second for frames
    laplace_video_pyramid = [[0 for x in range(video_stack.shape[0])] for x in range(levels)]

    for i in range(video_stack.shape[0]):
        frame = video_stack[i]
        pyr = create_laplacian_pyramid(frame, levels)

        for n in range(levels):
            laplace_video_pyramid[n][i] = pyr[n]

    return laplace_video_pyramid

def reconstruct(filtered_video, levels):
    '''
    Reconstructs a video sequence from the filtered Laplace video pyramid
    :param filtered_video: 2 dimensional video sequence - 1st. index pyramid levels, 2nd. - video frames
    :param levels: pyramid levels
    :return: video sequence
    '''
    print('Reconstructing Video')
    sio.emit(event='messages', data={'logs': 'Reconstructing Video','type':'info'})

    final = np.empty(filtered_video[0].shape)
    for i in range(filtered_video[0].shape[0]):  # iterate through frames

        up = filtered_video[-1][i]  # highest level
        for k in range(levels-1, 0, -1):  # going down to lowest level
            size = (filtered_video[k-1][i].shape[1], filtered_video[k-1][i].shape[0])  # reshape
            up = cv2.pyrUp(up, dstsize=size) + filtered_video[k-1][i]

        final[i] = up

    return final

def calculate_pyramid_levels(vidWidth, vidHeight):
    '''
    Calculates the maximal pyramid levels for the Laplacian pyramid
    :param vidWidth: video frames' width
    :param vidHeight: video frames' height
    '''
    if vidWidth < vidHeight:
        levels = int(np.log2(vidWidth))
    else:
        levels = int(np.log2(vidHeight))


    return levels

def butter_bandpass(lowcut, highcut, fs, order=1):
    '''
    Calculates the Butterworth bandpass filter
    :param lowcut: low frequency cutoff
    :param highcut: high frequency cutoff
    :param fs: video frame rate
    :param order: filter order - per default = 1
    :return: Numerator (b) and denominator (a) polynomials of the IIR filter.
    '''

    low = lowcut / fs
    high = highcut / fs
    b, a = butter(order, [low, high], btype='band')
    return b, a

def apply_butter(laplace_video_list, levels, alpha, cutoff, low, high, fps, width, height, linearAttenuation):
    '''
    Applies the Butterworth filter on video sequence, magnifies the filtered video sequence
    and cuts off spatial frequencies
    :param laplace_video_list: Laplace video pyramid
    :param levels: Pyramid levels
    :param alpha: Magnification factor
    :param cutoff: Spatial frequencies cutoff factor
    :param low: Temporal low frequency cutoff
    :param high: Temporal high frequency cutoff
    :param fps: Video frame rate
    :param width: Video frame width
    :param height: Video frame height
    :param linearAttenuation: Boolean if linear attenuation should be applied
    :return:
    '''

    print('Applying Butterworth Filter')
    sio.emit(event='messages', data={'logs': 'Applying Butterworth Filter','type':'info'})
    filtered_video_list = []
    b, a = butter_bandpass(low, high, fps, order=1)

    # spacial wavelength lambda
    lambda1 = (width ** 2 + height ** 2) ** 0.5

    delta = cutoff / 8 / (1 + alpha)

    for i in range(levels):  # pyramid levels

        current_alpha = lambda1 / 8 / delta - 1  # given in paper
        current_alpha /= 2

        # apply the butterworth filter onto temporal image sequence
        filtered = lfilter(b, a, laplace_video_list[i], axis=0)

        if i == levels - 1 or i == 0:  # ignore lowest and highest level
            filtered *= 0

        # spacial frequencies attenuation
        if current_alpha > alpha:
            filtered *= alpha
        else:
            if linearAttenuation:
                filtered *= current_alpha
            else:
                filtered *= 0

        filtered_video_list.append(filtered)

        lambda1 /= 2

    return filtered_video_list

def butterworth_filter(vidFile, alpha, cutoff, low, high, linearAttenuation, chromAttenuation, name):
    '''
    Performs motion magnification on the video by applying Butterworth bandpass filter and saves the output video
    :param vidFile: Video file
    :param alpha: Magnification factor
    :param cutoff: Spatial frequencies cutoff factor
    :param low: Temporal low frequency cutoff
    :param high: Temporal high frequency cutoff
    :param linearAttenuation: Boolean if linear attenuation should be applied
    :param chromAttenuation: Boolean if chrominance attenuation should be applied
    :param name: Output video name
    '''
    t, fps, width, height = load_video(vidFile)

    #  from rgb to yiq
    t = RGB2YIQ(t)

    levels = calculate_pyramid_levels(width, height)

    # build laplace pyramid for each video frame
    lap_video_list = laplacian_video_pyramid(t, levels)

    # apply butterworth filter
    filtered_video_list = apply_butter(lap_video_list, levels, alpha, cutoff, low, high, fps, width, height, linearAttenuation)

    final = reconstruct(filtered_video_list, levels)

    # chromatic attenuation
    final[:][:][:][1] *= chromAttenuation
    final[:][:][:][2] *= chromAttenuation

    # Add to original
    final += t

    # from yiq to rgb
    final = YIQ2RGB(final)

    # Cutoff wrong values
    final[final < 0] = 0
    final[final > 255] = 255
    print('Done!!')
    sio.emit(event='messages', data={'logs': 'Loading Video','type':'success'})
    return {"final":final, "fps":fps, "name":name}
    # save_video(final, fps, name)

    

def ideal_filter(vidFile, alpha, low, high, chromAttenuation, name):
    '''
    Performs color magnification on the video by applying an ideal bandpass filter,
    i.e. applies a discrete fourier transform on the gaussian downsapled video and
    cuts off the frequencies outside the bandpass filter, magnifies the result and
    saves the output video
    :param vidFile: Video file
    :param alpha: Magnification factor
    :param low: Temporal low frequency cutoff
    :param high: Temporal high frequency cutoff
    :param chromAttenuation: Boolean if chrominance attenuation should be applied
    :param name: Output video name
    '''

    t, fps, width, height = load_video(vidFile)

    #  from rgb to yiq
    t = RGB2YIQ(t)

    levels = 5

    # build Gaussian pyramid and use the highest level
    gauss_video_list = gaussian_video(t, levels)

    print('Applying Ideal Filter')
    sio.emit(event='messages', data={'logs': 'Applying Ideal Filter','type':'info'})
    # apply discrete fourier transformation (real)
    fft = fftpack.rfft(gauss_video_list, axis=0)
    frequencies = fftpack.rfftfreq(fft.shape[0], d=1.0 / fps)  # sample frequencies
    mask = np.logical_and(frequencies > low, frequencies < high)  # logical array if values between low and high frequencies

    fft[~mask] = 0  # cutoff values outside the bandpass

    filtered = fftpack.irfft(fft, axis=0)  # inverse fourier transformation

    filtered *= alpha  # magnification

    # chromatic attenuation
    filtered[:][:][:][1] *= chromAttenuation
    filtered[:][:][:][2] *= chromAttenuation

    # resize last gaussian level to the frames size
    filtered_video_list = np.zeros(t.shape)
    for i in range(t.shape[0]):
        f = filtered[i]
        filtered_video_list[i] = cv2.resize(f, (t.shape[2], t.shape[1]))

    final = filtered_video_list

    # Add to original
    final += t

    # from yiq to rgb
    final = YIQ2RGB(final)

    # Cutoff wrong values
    final[final < 0] = 0
    final[final > 255] = 255

    return {"final":final, "fps":fps, "name":name}
    # print('Done!!')
    # save_video(final, fps, name)


def process_video_Eulerian(vid,mode,alpha=10, cutoff=48, low=0.5,high=1,chromAttenuation=0,linearAttenuation=True, socket=sio):
    '''
    Reads the input from the user and uses the parameters to start the program
    '''    
    global sio
    sio=socket
    print(sio)
    base = os.path.basename(vid)
    name = os.path.splitext(base)[0]
    print(name)
    
    print(alpha)
    print(cutoff)
    print(low)
    print(high)
    print(chromAttenuation)
    print(linearAttenuation)

    if mode == 0:
        # alpha = float(input("Enter Magnification Factor: "))
        # cutoff = float(input("Enter Spatial Cutoff Frequency: "))
        # low = float(input("Enter Lower Temporal Cutoff Frequency: "))
        # high = float(input("Enter Higher Temporal Cutoff Frequency: "))
        # chromAttenuation = float(input("Enter Chromatic Attenuation Factor: "))
        # linearAttenuation = input("Enter Linear Attenuation(True/False): ").lower() == 'true'
        return butterworth_filter(vid, alpha, cutoff, low, high, linearAttenuation, chromAttenuation, name)

    elif mode == 1:
        # alpha = float(input("Enter Magnification Factor: "))
        # low = float(input("Enter Lower Temporal Cutoff Frequency: "))
        # high = float(input("Enter Higher Temporal Cutoff Frequency: "))
        # chromAttenuation = float(input("Enter Chromatic Attenuation Factor: "))
        return ideal_filter(vid, alpha, low, high, chromAttenuation, name)

# if __name__ == "__main__":
#     process_video_Eulerian()