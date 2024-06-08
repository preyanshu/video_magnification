from io import BytesIO
from flask import Flask, jsonify, request, send_file, url_for
from flask_socketio import SocketIO,emit
from flask_cors import CORS
import os
import mediapy
import requests
import numpy as np
import cv2


from Eulerian_Magnification import process_video_Eulerian 
from Phase_Based_Magnification import process_video_Phase 

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app)
socketio = SocketIO(app,cors_allowed_origins="*")

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@socketio.on('connect',namespace='/')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect',namespace='/')
def handle_disconnect():
    print('Client disconnected')


def save_video_combined(result=None, output_path=None, video_tensor=None, fps=None, name=None, technique=None):
    if technique == 'phase':
        if output_path is None:
            socketio.emit(event='messages', data={'logs': 'Output path is required for Phase technique','type':'error'})
            raise ValueError("Output path is required for Phase technique")

        mediapy.write_video(output_path, result)
        global filename
        filename = output_path
        return output_path

    elif technique == 'eulerian':
        if video_tensor is None or fps is None or name is None:
            socketio.emit(event='messages', data={'logs': 'video_tensor, fps, and name are required for Evm technique','type':'error'})
            raise ValueError("video_tensor, fps, and name are required for Evm technique")

        print('Saving Video')
        print(output_path)
        output_directory = os.path.dirname(output_path)
        if output_directory == "":
            output_directory = "." 
        print(output_directory)
        output_file_path = os.path.join(output_directory, name + "_Eulerian_Magnification.mp4")
        print(output_file_path)
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')  # Use 'mp4v' fourcc for MP4 format
        [height, width] = video_tensor[0].shape[0:2]
        writer = cv2.VideoWriter(output_file_path, fourcc, fps, (width, height), True)  # Use .mp4 extension in the output file name
        for i in range(video_tensor.shape[0]):
            writer.write(cv2.convertScaleAbs(video_tensor[i]))
        writer.release()
        return output_file_path

    else:
        socketio.emit(event='messages', data={'logs': 'Invalid technique provided','type':'error'})
        raise ValueError("Invalid technique provided")



@app.route('/upload', methods=['POST'])
def upload_file():
    if request.is_json:
        data = request.get_json()  # Retrieve JSON data
        url = data.get('url') 
        file = request.files.get('file')  
        technique = data.get('techniuqe')
    params = request.form.to_dict()  # Retrieve all form parameters
    processed_file_path=None
    
    if not file and not url:
        socketio.emit(event='messages', data={'logs': 'Output path is required for Phase technique','type':'error'})
        print("No file or URL provided")
        return jsonify({'error': "No file"})

    if file:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
    elif url:
        try:
            response = requests.get(url)
            video_bytes = BytesIO(response.content)
            video_path = os.path.join(app.config['UPLOAD_FOLDER'], 'downloaded_video.mp4')
            with open(video_path, 'wb') as f:
                f.write(video_bytes.read())
            file_path = video_path
            socketio.emit(event='messages', data={'logs': 'Video Fetched Successfully!','type':'info'})
        except Exception as e:
            socketio.emit(event='messages', data={'logs': f"Error downloading video: {str(e)}",'type':'error'})
            return f"Error downloading video: {str(e)}"

    if technique == 'eulerian':
        if params['mode'] == "0":
            # Extracting Eulerian linear mode parameters
            mode=0
            alpha = float(params.get('alpha', 10))
            cutoff = float(params.get('cutoff', 45))
            low = float(params.get('low', 0.5))
            high = float(params.get('high', 1))
            chromAttenuation = float(params.get('chromAttenuation', 0))
            linearAttenuation = bool(params.get('linearAttenuation', True))
            result = process_video_Eulerian(vid=file_path, mode= mode, alpha=alpha,cutoff= cutoff,low= low,high=high,chromAttenuation= chromAttenuation,linearAttenuation=linearAttenuation,socket=socketio)
            
        elif params['mode'] == "1":
            # Extracting Eulerian mode 2 parameters
            mode=1
            alpha = float(params.get('alpha', 0.5))
            low = float(params.get('low', 0.3))
            high = float(params.get('high', 0.8))
            chromAttenuation = float(params.get('chromAttenuation', 0.6))

            result = process_video_Eulerian(file_path,mode, alpha=alpha, low=low, high=high,
                                            chromAttenuation=chromAttenuation,socket=socketio)
        else :
            socketio.emit(event='messages', data={'logs': 'Invalid mode provided','type':'error'})
            return jsonify({"error": "Invalid mode provided"})

    elif technique == 'phase':
        # Extracting Phase-based parameters
        magnification_factor = float(params.get('magnification_factor', 20.0))
        f1 = float(params.get('f1', 0.04))
        fh = float(params.get('fh', 0.4))
        fs = float(params.get('fs', 1))
        attenuate_other_freq = bool(params.get('attenuate_other_frequencies', True))
        pyr_type = params.get('pyr_type', 'octave')
        sigma = float(params.get('sigma', 5))

        result = process_video_Phase(file_path, pyr_type, magnification_factor, f1, fh, fs,attenuate_other_freq,sigma,socket=socketio)

        # Processing and saving the video...
        output_path = os.path.splitext(file_path)[0] + f"_{technique}_magnified.mp4"
        # processed_file_path = save_video_combined(result=result, output_path=output_path, technique=technique)

    else:
        socketio.emit(event='messages', data={'logs': 'Invalid technique specified','type':'error'})
        return jsonify({'error': "Invalid technique specified"})
    
    output_path = os.path.splitext(file_path)[0] + f"_{technique}_magnified.mp4"
    if(technique == "phase"):
        processed_file_path=save_video_combined(result=result, output_path=output_path,technique=technique)

    if(technique == "eulerian"):
        processed_file_path=save_video_combined(result=result, output_path=output_path,video_tensor=result["final"], fps=result["fps"], name=result["name"], technique=technique)

    
    if(processed_file_path==None):
        response.status_code = 500
        socketio.emit(event='messages', data={'logs': 'Invalid technique specified','type':'error'})
        return jsonify({'Technique': "Invalid technique specified"})
    video_url = url_for('uploaded_file', filename=processed_file_path, _external=True, download='true')
    return jsonify({'video_url': video_url})


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_file(os.path.join(filename),mimetype='video/mp4',as_attachment=True)

@app.route('/graph') 
def generate_waveform(video_path_org):
    video_path_mag = video_path_org[:-4] + 'Out.mp4'
    graph_path_org = video_path_org[:-4] + '_time_waveform.png'

    cap_org = cv2.VideoCapture(video_path_org)
    time_waveform_org = []
    frame_rate = 0

    while cap_org.isOpened():
        ret_org, frame_org = cap_org.read()
        if not ret_org:
            break
        frame_rate = cap_org.get(cv2.CAP_PROP_FPS)
        mean_value_org = np.mean(frame_org)
        time_waveform_org.append(mean_value_org)
    cap_org.release()
    min_value_org = np.min(time_waveform_org)
    max_value_org = np.max(time_waveform_org)
    mid_value_org = (max_value_org + min_value_org) / 2
    time_waveform_org_mid = np.subtract(time_waveform_org, mid_value_org)

    cap_mag = cv2.VideoCapture(video_path_mag)
    time_waveform_mag = []

    while cap_mag.isOpened():
        ret_mag, frame_mag = cap_mag.read()
        if not ret_mag:
            break
        mean_value_mag = np.mean(frame_mag)
        time_waveform_mag.append(mean_value_mag)
    cap_mag.release()
    min_value_mag = np.min(time_waveform_mag)
    max_value_mag = np.max(time_waveform_mag)
    mid_value_mag = (max_value_mag + min_value_mag) / 2
    time_waveform_mag_mid = np.subtract(time_waveform_mag, mid_value_mag)

    time_waveform_mag = np.array(time_waveform_mag)
    vibration = np.subtract(time_waveform_mag, time_waveform_org)
    vibration_mid = np.subtract(vibration, np.mean(vibration))

    time_waveform_org = np.array(time_waveform_org)
    time_axis = np.arange(len(time_waveform_org)) / frame_rate

    plt.plot(time_axis, time_waveform_org_mid, 'r')
    plt.plot(time_axis, time_waveform_mag_mid, 'b')
    plt.plot(time_axis, vibration_mid, 'g')
    plt.plot(time_axis, np.zeros_like(time_axis), 'black', alpha=0.5)
    plt.xlabel('Time (seconds)')
    plt.ylabel('Pixel Vibration')
    plt.title('Time Waveform')
    plt.legend(['Original', 'Magnified', 'Vibration'])
    plt.savefig(graph_path_org, dpi=1600)
    plt.show()


if __name__ == "__main__":
    socketio.run(app,debug=True,port=5001)
     



