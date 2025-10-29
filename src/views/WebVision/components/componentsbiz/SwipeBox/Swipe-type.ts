export interface SwipeModelOne {
  model: 's1'
  swipeData: SwipeOneItem[]
  otherAttrs: {
    [key: string]: any
  }
}
interface SwipeOneItem {
  image: string
  link: string
  alt: string
}

export interface SwipeModelTwo {
  model: 's2'
  swipeData: SwipeTwoItem[]
  total: number
  groupSize: number
  otherAttrs: {
    [key: string]: any
  }
}
interface SwipeTwoItem {
  image: string
  link: string
  alt: string
  index: number
}

export interface SwipeModelThree {
  model: 's3'
  swipeData: SwipeItem[]
  otherAttrs: {
    [key: string]: any
  }
}
interface SwipeItem {
  name: string
  content: string
}
// interface PropsType {
//   imageData: ImageType[];
//   total: number;
//   option: {
//     groupSize: number;
//   };
//   otherAttrs: {
//     [key: string]: any;
//   };
// }
// interface ImageType {
//   index: number;
//   image: string;
//   link: string;
//   alt: string;
// }
