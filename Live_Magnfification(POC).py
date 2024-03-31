import cv2
import scipy.signal as signal
from matplotlib import pyplot as plt
from skimage import img_as_float, img_as_ubyte
import numpy as np
import time
import pyrtools as pt
import copy

# Reconstruct pyramid is being done here. 
def reconPyr(pyr):
	# Reconstruct the pyramid now.                                                
    filt2 = 'binom5'                #The binomial filter for image reconstruction 
    edges = 'reflect1';             #The edges is reflect1. I have used this here. 
    maxLev = len(pyr)
    levs = range(0,maxLev)                 # The levels is range(0,maxLev)
    filt2 = pt.binomial_filter(5)  #The named Filter filt2 . This has been finalized here. 
    res = []
    lastLev = -1
    # for lev in range(levels).
    for lev in range(maxLev-1, -1, -1):
        if lev in levs and len(res) == 0:
            res = pyr[lev]
        elif len(res) != 0:
            res_sz = res.shape
            new_sz = pyr[lev].shape
            filt2_sz = filt2.shape
            if res_sz[0] == 1:
                hi2 = pt.upConv(image = res, filt = filt2,
                                        step = (2,1), 
                                        stop = (new_sz[1], new_sz[0])).T
            elif res_sz[1] == 1:
                hi2 = pt.upConv(image = res, filt = filt2.T,
                                        step = (1,2), 
                                        stop = (new_sz[1], new_sz[0])).T
            else:
                hi = pt.upConv(image = res, filt = filt2, 
                                       step = (2,1), 
                                       stop = (new_sz[0], res_sz[1]))
                hi2 = pt.upConv(image = hi, filt = filt2.T, 
                                       step = (1,2),
                                       stop = (new_sz[0], new_sz[1]))
            if lev in levs:
                bandIm =  pyr[lev]
                bandIm_sz = bandIm.shape
                res = hi2 + bandIm
            else:
                res = hi2
    return res                           

# Magnify only the grayscale image. 
class Magnify(object):
	def __init__(self, gray1,alpha, lambda_c, fl, fh,samplingRate):
        # Applying Butterworth filter
		[low_a,low_b] = signal.butter(1,fl/samplingRate,'low')
		[high_a,high_b] = signal.butter(1,fh/samplingRate,'low')
		# For py1 in range number of levels. 
		py1 = pt.pyramids.LaplacianPyramid(gray1)
		py1._build_pyr()
		# Building the initial pyramid. 
		pyramid_1 = py1.pyr_coeffs
		# Pyramid_1 has 7 keys.
		nLevels = len(pyramid_1)
		self.filtered = pyramid_1
		self.alpha  = alpha
		self.fl = fl
		self.fh = fh
		self.samplingRate = samplingRate
		self.low_a = low_a
		self.low_b = low_b
		self.high_a = high_a
		self.high_b = high_b
		self.width = gray1.shape[0]
		self.height = gray1.shape[1]
		self.gray1 = img_as_float(gray1)
		self.lowpass1 = copy.deepcopy(pyramid_1)
		self.lowpass2 = copy.deepcopy(self.lowpass1)
		self.pyr_prev = copy.deepcopy(pyramid_1)
		self.filtered = [None for _ in range(nLevels)]
		self.nLevels = nLevels
		self.lambd = (self.width^2+self.height^2)/3.
		self.lambda_c = lambda_c
		self.delta =  self.lambda_c/8./(1+self.alpha) 
# Building Laplacian Pyramid
# Applying filter and space time processing(among frequency bands and pyramid levels)
# Reconstructing the pyramid
	def Magnify(self, gray2): 
		u = 0
		l = 0
		gray2 = img_as_float(gray2)
		# Building second pyramid. 
		py2 = pt.pyramids.LaplacianPyramid(gray2)
		py2._build_pyr()
		pyr = py2.pyr_coeffs
		nLevels = self.nLevels
		for u in range(nLevels):
			self.lowpass1[(u,0)] = (-self.high_b[1]*self.lowpass1[(u,0)] + self.high_a[0]*pyr[(u,0)]+ self.high_a[1]*self.pyr_prev[(u,0)])/self.high_b[0]
			self.lowpass2[(u,0)] = (-self.low_b[1]*self.lowpass2[(u,0)]+ self.low_a[0]*pyr[(u,0)] + self.low_a[1]*self.pyr_prev[(u,0)])/self.low_b[0]
			self.filtered[u] = self.lowpass1[(u,0)]-self.lowpass2[(u,0)]
		self.pyr_prev = copy.deepcopy(pyr)
		exaggeration_factor = 2                                       
		lambd = self.lambd
		delta = self.delta
		filtered  = self.filtered
		for l in range(nLevels-1,-1,-1):
			currAlpha = lambd/delta/8. - 1                            
			currAlpha = currAlpha*exaggeration_factor
			if(l == nLevels - 1 or l==0):
				filtered[l] = np.zeros(np.shape(filtered[l]))
			elif (currAlpha>self.alpha):
				filtered[l] = self.alpha*filtered[l]  
			else:
				filtered[l] = currAlpha*filtered[l]           
			lambd = lambd/2.
		# Reconstruct the pyramid using filtered. 
		output = reconPyr(filtered)          
		output += gray2
		output[output<0] = 0
		output[output>1] = 1 
		output = img_as_ubyte(output)
		return output

if __name__ == '__main__':
    fps = 8.
    alpha = 3000
    lambda_c = 200
    fl = 0.3
    fh = 1
    cam = cv2.VideoCapture(0)
    _, img1 = cam.read()
    gray = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
    s = Magnify(gray, alpha, lambda_c, fl, fh, fps)
    
    # Create empty lists to store the intensity values
    original_intensity = []
    magnified_intensity = []
    
    # Create a figure and axes for the graphs
    fig, ax = plt.subplots()
    
    # Create line objects for the graphs
    original_line, = ax.plot([], [], label='Original', scaley=True, scalex=True)
    magnified_line, = ax.plot([], [], label='Magnified', scaley=True, scalex=True)
    
    # Set the labels and title
    ax.set_xlabel('Frame')
    ax.set_ylabel('Intensity')
    ax.set_title('Intensity of Pixels')
    
    # Add a legend
    ax.legend()
    
    # Show the plot
    plt.ion()  # Turn on interactive mode
    plt.show()
    
    frame_check = 10  # Update graph every 10 frames
    frame_counter = 0
    
    # Create a figure for frequency domain analysis
    fig_freq, ax_freq = plt.subplots()
    ax_freq.set_xlabel('Frequency (Hz)')
    ax_freq.set_ylabel('Amplitude')
    ax_freq.set_title('Frequency Domain Analysis of Original vs Magnified Intensity')
    ax_freq.legend(['Original', 'Magnified'])
    plt.ion()
    plt.show()
    
    while True:
        t1 = time.perf_counter()
        _, final_img = cam.read()
        gray = cv2.cvtColor(final_img, cv2.COLOR_BGR2GRAY)
        out = s.Magnify(gray)
        cv2.imshow('final_img', final_img)
        cv2.imshow('final', out[..., np.newaxis])
        
        # Calculate the intensity values of the original and magnified frames
        original_intensity.append(np.mean(gray))
        magnified_intensity.append(np.mean(out[..., np.newaxis]))
        
        # Update the x and y data of the lines after 10 frames
        frame_counter += 1
        if frame_counter >= frame_check:
            # Update the x and y data of the lines
            original_line.set_data(range(len(original_intensity)), 2*np.mean(original_intensity)-original_intensity)
            magnified_line.set_data(range(len(magnified_intensity)), magnified_intensity)
            # Update the plot
            ax.relim()
            ax.autoscale_view()
            fig.canvas.draw()
            plt.pause(0.01)  # Control the refresh rate
            frame_counter = 0
            
            # Perform FFT and plot the frequency domain analysis
            fft_original = np.fft.fft(original_intensity)
            fft_magnified = np.fft.fft(magnified_intensity)
            freq = np.fft.fftfreq(len(original_intensity))
            
            ax_freq.clear()
            ax_freq.plot(freq, np.abs(fft_original), label='Original')
            ax_freq.plot(freq, np.abs(fft_magnified), label='Magnified')
            ax_freq.set_ylim(0, 3000)  # Adjust the y-axis limit
            # ax_freq.set_xlim(0, max(freq))  # Adjust the x-axis limit
            ax_freq.legend()
            
            fig_freq.canvas.draw()
            plt.pause(0.001)  # Control the refresh rate
        
        k = cv2.waitKey(1)
        if k == 27:
            break
        t2 = time.perf_counter()