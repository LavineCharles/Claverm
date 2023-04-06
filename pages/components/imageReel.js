import { useState, useRef, useEffect } from 'react';
import styles from '../../styles/ImageReel.module.css';
import { wait } from '../../utils';
import Animate from './animate';
import ArrowNavigation from './arrowNavigation';

const IMAGE_TIME = 3000;

const ImageReel = ({
    images,
    width = "100%",
    height = 700
}) => {
    const [topImageIndex, setTopImageIndex] = useState(0);
    const [bottomImageIndex, setBottomImageIndex] = useState(1);
    const [canSwitch, setCanSwitch] = useState(true);
    const intervalRef = useRef(null);
    const topImageIndexRef = useRef(0);

    const animateFunctions = useRef({});

    const getNewNextImageIndex = (index) => {
        if (index === images.length) return 0;
        if (index === -1) return images.length - 1;
        return index;
    }

    const fadeAndSwitch = async (toIndex) => {
        setCanSwitch(false);
        setBottomImageIndex(toIndex);
        await animateFunctions.current.fadeOut();
        setTopImageIndex(toIndex);
        topImageIndexRef.current = toIndex;
        await wait(100);
        await animateFunctions.current.reset();
        setCanSwitch(true);
    };

    const fadeAndSwitchNext = () => {
        const nextNextIndex = getNewNextImageIndex(topImageIndexRef.current + 1);
        fadeAndSwitch(nextNextIndex);
    }

    useEffect(() => {
        intervalRef.current = setInterval(fadeAndSwitchNext, IMAGE_TIME);
        return () => clearInterval(intervalRef.current);
    }, []);

    const clickArrow = (left = false) => {
        clearInterval(intervalRef.current);
        if (!canSwitch) return;
        const nextIndexUncorrected = topImageIndexRef.current + (left ? -1 : 1);
        const nextNextIndex = getNewNextImageIndex(nextIndexUncorrected);
        fadeAndSwitch(nextNextIndex);
    };

    return (
        <div className={styles.mainImage}>
            <ArrowNavigation clickArrow={clickArrow} height={height} />
            <Animate getMethods={funcsObject => animateFunctions.current = funcsObject}>
                <img
                    className={styles.image}
                    style={{
                        width,
                        height,
                        zIndex: 1
                    }}
                    src={images[topImageIndex]}
                    alt="main-image"
                ></img>
            </Animate>
            <img
                className={styles.image}
                style={{
                    width,
                    height,
                    zIndex: -1
                }}
                src={images[bottomImageIndex]}
                alt="secondary-image"
            ></img>
            <div style={{ width, height }} />
        </div>
    );
}

export default ImageReel;