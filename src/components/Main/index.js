import React, { Component } from 'react';
import * as tf from '@tensorflow/tfjs';
import { TFWrapper } from './utils';
import { Flex } from '../reusable';
import {
  EMOJI_IMAGES,
  MODEL_JSON,
  LABELS_URL,
} from '../../constants';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detectIsOn: false,
      emoji: null,
      labels: null,
      model: null,
      video: null,
    };
    this.vidRef = React.createRef();
  }

  componentDidMount() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const webCamPromise = navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: 'user',
          },
        })
        .then((stream) => {
          window.stream = stream;
          this.vidRef.current.srcObject = stream;
          return new Promise((resolve, _) => {
            this.vidRef.current.onloadedmetadata = () => {
              resolve();
            };
          });
        });
      const modelPromise = tf.loadGraphModel(MODEL_JSON);
      const labelsPromise = LABELS_URL;
      Promise.all([modelPromise, labelsPromise, webCamPromise])
        .then((values) => {
          const [model, labels] = values;
          this.setState(prevState => ({
            ...prevState,
            video: this.vidRef.current,
            model,
            labels,
          }));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.detectIsOn) {
      this.detectFrame(this.state.video, this.state.model, this.state.labels);
    }
  }

  detectFrame = (video, model, labels) => {
    if (!this.state.detectIsOn) return;
    TFWrapper(model)
      .detect(video)
      .then((predictions) => {
        if (predictions) {
          this.renderPredictions(predictions, labels);
        }
        requestAnimationFrame(() => {
          this.detectFrame(video, model, labels);
        });
      });
  }

  renderPredictions = (predictions, labels) => {
    if (predictions) {
      let label = '';
      predictions.forEach((prediction) => {
        label = labels[parseInt(prediction.class, 10)];
      });
      const emoji = EMOJI_IMAGES.filter(emo => emo.sign === label);
      if (emoji.length === 1) {
        this.setState(prevState => ({ ...prevState, emoji: emoji[0] }));
      }
    }
  }

  handleDetectChange = () => {
    this.setState(prevState => ({ ...prevState, detectIsOn: !prevState.detectIsOn }));
  }

  render() {
    const text = this.state.detectIsOn ? 'Turn Detect Off' : 'Turn Detect On';
    return (
      <Flex justifyContent='space-around'>
        <Flex>
          <video
            className="size"
            autoPlay
            playsInline
            muted
            ref={this.vidRef}
            width="600"
            height="500"
          />
        </Flex>
        <Flex alignItems='flex-start' flexDirection='column' justifyContent='space-between' overrideStyle={{ width: 600 }}>
          <button onClick={this.handleDetectChange}>{text}</button>
          {this.state.emoji && <img src={this.state.emoji.image} alt={this.state.emoji.sign} />}
        </Flex>
      </Flex>
    );
  }
}

export default Main;
