import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { useState, useEffect, useCallback } from 'react';
import { useMediaQuery } from 'react-responsive';

import { NextButton, PrevButton } from './CarouselButton';
import { BannerResponseProps } from '../../types/bannerTypes';
import { PLACEHOLDER_IMAGE, PLACEHOLDER_TITLE } from '../../utils/placeholders';

import styles from './styles.module.scss';

type CarouselProps = {
  data: Array<BannerResponseProps>;
};

export const Carousel = ({ data }: CarouselProps) => {
  const isMobile = useMediaQuery({ maxWidth: 820 });
  const [viewportRef, embla] = useEmblaCarousel({
    skipSnaps: false,
    loop: true,
  });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setPrevBtnEnabled(embla.canScrollPrev());
    setNextBtnEnabled(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    embla.on('select', onSelect);
  }, [embla, onSelect]);

  return (
    <div className={styles.carousel}>
      <div className={styles.viewport} ref={viewportRef}>
        <div className={styles.container}>
          {(data && data.length ? data : [{
            _id: 'placeholder-banner',
            title: PLACEHOLDER_TITLE,
            link: '#',
            mobileImage: { url: PLACEHOLDER_IMAGE },
            desktopImage: { url: PLACEHOLDER_IMAGE },
          } as any]).map((banner) => (
            <div className={styles.slide} key={banner._id}>
              <div className={styles.slide_inner}>
                <Link
                  href={
                    banner?.link.match(/^(http|https):/)
                      ? banner.link
                      : `https://${banner.link}`
                  }
                >
                  <a target="_blank">
                    <Image
                      objectFit="cover"
                      layout="fill"
                      className={styles.slide_img}
                      src={
                        isMobile
                          ? (banner?.mobileImage?.url || PLACEHOLDER_IMAGE)
                          : (banner?.desktopImage?.url || PLACEHOLDER_IMAGE)
                      }
                      alt={banner?.title || PLACEHOLDER_TITLE}
                      priority
                      placeholder="blur"
                      blurDataURL={banner?.desktopImage?.url || PLACEHOLDER_IMAGE}
                    />
                  </a>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
      <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
    </div>
  );
};
