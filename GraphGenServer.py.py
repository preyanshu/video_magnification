import cv2
import numpy as np
import matplotlib.pyplot as plt

def save_and_display_graph(video_path_org, video_path_mag, graph_path_org):
    # Original
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

    time_waveform_org = np.array(time_waveform_org)
    time_axis = np.arange(len(time_waveform_org)) / frame_rate

    # Magnified
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

    plt.plot(time_axis, time_waveform_org_mid, 'r')
    plt.plot(time_axis, time_waveform_mag_mid, 'b')
    plt.plot(time_axis, vibration_mid, 'g')
    plt.plot(time_axis, np.zeros_like(time_axis), 'black', alpha=0.5)
    plt.xlabel('Time (seconds)')
    plt.ylabel('Pixel Vibration')
    plt.title('Time Waveform')
    plt.legend(['Original', 'Magnified', 'Vibration'])
    plt.savefig(graph_path_org)
    plt.show()

    return graph_path_org

# Example usage
video_path_org = input("Enter the path to the original video file: ")
video_path_mag = video_path_org[:-4] + 'Out.mp4'
graph_path_org = video_path_org[:-4] + '_time_waveform.png'

saved_graph_path = save_and_display_graph(video_path_org, video_path_mag, graph_path_org)
print("Graph saved at:", saved_graph_path)
