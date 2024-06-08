

# System Architecture:
![System Architecture](Static/s_design.png)

# Frontend:
![Frontend](Static/frontend.jpg)
![Frontend](Static/frontend2.png)
![Frontend](Static/frontend3.png)


# Analysis Report:
![Analysis Report](Static/live.jpg)

# Motion Amplification Vibration Monitoring System

The Motion Amplification Vibration Monitoring System is an innovative project aimed at merging human and machine health monitoring using cutting-edge technology. By harnessing Video Magnification, Computer Vision, and Machine Learning Algorithms, our system provides comprehensive insights into machinery and human well-being.

## Features

- **Eulerian Video Magnification**: Enhance video footage to make subtle motion patterns, vibrations, and color changes more visible.
- **Human Health Analysis**: Utilize video footage to examine human movements, generate health parameter graphs using computer vision, and provide detailed health reports using machine learning algorithms.
- **Use Cases**:
  - Respiratory Rate Monitoring: Identify irregular breathing patterns and track breath frequency.
  - Heart Rate Monitoring: Continuously monitor heart rate to assess cardiovascular health and fitness levels.
  - Aircraft Engine Health Analysis: Assess aircraft engine health by detecting vibrations and micro-scale defects to prevent unexpected failures.

## Dependencies

- Flask: Python web framework for backend development.
- OpenCV: Computer vision library for video processing.
- TensorFlow/Keras: Machine learning framework for developing health analysis models.

## Show Stoppers

- Universal Device Compatibility: Ensure flawless performance across a spectrum of devices, including web, windows and Android platforms.
- Real Time Motion Magnification using Frame-By-Frame Difference of Vibrations.

  # Overview
Harnessing Video Magnification, Computer Vision, and Machine Learning Algorithms, the system provides comprehensive insights into machinery and human health.

## Working Architecture
(Refer to the diagram in the project repo for a visual representation.)

### Backend:
1. **API Server for Magnification (Node.js):** Hosted on Replit for hackathon purposes, this server acts as an API server forwarding calls to the magnification server.

2. **Server Report Generator (Node.js):** Another API server hosted on Replit, responsible for making calls to the AI model with generated report images and objects extracted from frames. It calculates the average of responses from multiple calls and returns the result.

3. **Magnification Server (Flask):** A Python server that performs actual video magnification using Eulerian/phase magnification scripts. It processes the video and returns the magnified video link.

4. **Graph Generation Server (Python):** This component generates graphs from the magnified video. It sends images of the graphs and detected objects in the frame to the "Server Report Generator (Node.js)" via an API call.

5. **Live Magnification:** Developed as a proof of concept, this feature skips the process of applying filters and magnifies the video in real time. However, note that the magnification quality might not be optimal, and the video is grayscale.

### Frontend:
The React frontend allows users to select magnification parameters and upload videos to Cloudinary. The uploaded video link is then sent to the magnification server for further processing. Before uploading, the video undergoes cropping and preprocessing to reduce resolution and frame rate, thus reducing the load on the magnification server. Additionally, it utilizes web sockets for real-time logs for video magnification.


## Usage

1. Clone the repository:

   ```bash
   git clone https://github.com/preyanshu/video_magnification.git
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Run the Flask application:

   ```bash
   python app.py
   ```

4. Access the application through the provided URL in your web browser.


## Prototype Video For Magnification:
https://youtu.be/Ni9JRBwZUow


## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any new features, improvements, or bug fixes.


