import {
  RefObject, useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react';

const images = [
  {
    idx: 0,
    src: './_new/img/banner-accessories.png',
    alt: 'Accessories',
  },
  {
    idx: 1,
    src: './_new/img/banner-phones.png',
    alt: 'Phones',
  },
  {
    idx: 2,
    src: './_new/img/banner-tablets.png',
    alt: 'Tablets',
  },
];

export const Carousel = () => {
  const container = useRef() as RefObject<HTMLDivElement>;
  const [currTransitionX, setCurrTransitionX] = useState(0);
  const [transitionDuration, setTransitionDuration] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [currImg, setCurrImg] = useState(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const slides = useMemo(() => {
    const items = images.map(img => (
      <li key={img.idx} className="carousel__item">
        <img src={img.src} alt={img.alt} className="carousel__img" />
      </li>
    ));

    return [
      <li key={images.length} className="carousel__item">
        <img
          src={images[images.length - 1].src}
          alt={images[images.length - 1].alt}
          className="carousel__img"
        />
      </li>,
      ...items,
      <li key={images.length + 1} className="carousel__item">
        <img
          src={images[0].src}
          alt={images[0].alt}
          className="carousel__img"
        />
      </li>,
    ];
  }, [...images]);

  const rightSlide = () => {
    setTransitionDuration(300);
    if (currImg === images.length) {
      setCurrTransitionX((images.length + 1) * containerWidth);
      setCurrImg(1);
    } else {
      setCurrTransitionX((currImg + 1) * containerWidth);
      setCurrImg(currImg + 1);
    }
  };

  const leftSlide = () => {
    setTransitionDuration(300);
    if (currImg === 1) {
      setCurrTransitionX(0);
      setCurrImg(images.length);
    } else {
      setCurrTransitionX((currImg - 1) * containerWidth);
      setCurrImg(currImg - 1);
    }
  };

  useLayoutEffect(() => {
    const width = container.current?.clientWidth || 0;

    setCurrTransitionX(width);
  }, []);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
      setTransitionDuration(0);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  useEffect(() => {
    setContainerWidth(container.current?.clientWidth || 0);
    setCurrTransitionX(currImg * containerWidth);
  }, [windowWidth]);

  useEffect(() => {
    const width = container.current?.clientWidth || 0;

    setCurrTransitionX(width);
  }, []);

  useEffect(() => {
    const transitionEnd = () => {
      if (currImg <= 1) {
        setTransitionDuration(0);
        setCurrTransitionX(currImg * containerWidth);
      }

      if (currImg >= images.length) {
        setTransitionDuration(0);
        setCurrTransitionX(images.length * containerWidth);
      }
    };

    window.addEventListener('transitionend', transitionEnd);

    return () => {
      window.removeEventListener('transitionend', transitionEnd);
    };
  }, [currImg]);

  /* useEffect(() => {
    const intervalId = setInterval(() => {
      rightSlide();
    }, 5000);

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }); */

  return (
    <div className="home-page__carousel carousel">
      <div className="carousel__container _container">
        <button
          type="button"
          aria-label="Mute volume"
          className="carousel__button carousel__button-left icon-button"
          onClick={leftSlide}
        />
        <div className="carousel__static-container" ref={container}>
          <ul
            className="carousel__dynamic-container"
            style={{
              transform: `translateX(${-currTransitionX}px)`,
              transitionDuration: `${transitionDuration}ms`,
            }}
          >
            {slides}
          </ul>
        </div>
        <button
          type="button"
          aria-label="Mute volume"
          className="carousel__button carousel__button-right icon-button"
          onClick={rightSlide}
        />
      </div>
    </div>
  );
};
