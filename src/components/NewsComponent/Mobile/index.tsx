import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import pt from 'date-fns/locale/pt';
import { format } from 'date-fns';

import { NewsResponseProps } from '../../../types/newsTypes';
import { replaceSpaceWithUnderscore } from '../../../utils/replaceSpaceWithUnderscore';

import styles from './styles.module.scss';

type NewsProps = {
  news: Array<NewsResponseProps>;
};

export const MobileNewsComponent = ({ news }: NewsProps) => {
  const router = useRouter();
  const [viewportRef, embla] = useEmblaCarousel({ skipSnaps: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const handleNews = (title: string, id: string) => {
    router.push(`/noticias/${id}?slug=${replaceSpaceWithUnderscore(title)}`);
  };

  const scrollTo = useCallback(
    (index: number) => embla && embla.scrollTo(index),
    [embla]
  );

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
  }, [embla, setSelectedIndex]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    setScrollSnaps(embla.scrollSnapList()!);
    embla.on('select', onSelect);
  }, [embla, setScrollSnaps, onSelect]);

  const mediaByIndex = (index: number) => news[index % news.length].url;

  return (
    <div className={styles.news}>
      <div className={styles.news__viewport} ref={viewportRef}>
        <div className={styles.news__container}>
          {news?.map((value, index) => (
            <div className={styles.news__slide} key={value?._id}>
              <div className={styles.news__slide__inner}>
                <Image
                  className={styles.news__slide__img}
                  src={mediaByIndex(index)}
                  alt={value?.title}
                  objectFit="cover"
                  layout="fill"
                />
              </div>

              <div className={styles.content}>
                <span>
                  {format(new Date(value?.updatedAt), 'dd, MMM yyyy', {
                    locale: pt,
                  })}
                </span>
                <h3>{value?.title}</h3>
                <p>{value?.altText}</p>
                <button onClick={() => handleNews(value?.title, value?._id)}>
                  Leia a História
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.news__dots}>
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`${styles.news__dot} ${
                index === selectedIndex ? styles.is_selected : ''
              }`}
              type="button"
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
