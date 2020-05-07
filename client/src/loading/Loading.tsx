import React from 'react';
import ReactLoading from 'react-loading';

type LoadingType = 'blank' | 'balls' | 'bars' | 'bubbles' | 'cubes' | 'cylon' | 'spin' | 'spinningBubbles' | 'spokes' | undefined;

const Loading = ({ type, color }: {type: LoadingType, color: string}) => (
  <ReactLoading type={type} color={color} height="20%" width="20%" />
);

export default Loading;
