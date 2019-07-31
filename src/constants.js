import Peace from './assets/peace.png';
import Cross from './assets/cross.png';
import Wave from './assets/wave.png';

const MODEL_URL = `${process.env.PUBLIC_URL}/model_weights/`;
export const LABELS_URL = ['Wave', 'Peace', 'Rock', 'Fist', 'Cross'];
export const MODEL_JSON = `${MODEL_URL}model.json`;
export const EMOJI_IMAGES = [
  {
    sign: 'Wave',
    image: Wave,
  },
  {
    sign: 'Peace',
    image: Peace,
  },
  {
    sign: 'Cross',
    image: Cross,
  },
];
