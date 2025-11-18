import { useMediaQuery } from 'react-responsive';
import { NewsResponseProps } from '../../types/newsTypes';
import { DesktopNewsComponent } from './Desktop';
import { MobileNewsComponent } from './Mobile';
import { PLACEHOLDER_IMAGE, PLACEHOLDER_TITLE, PLACEHOLDER_DESCRIPTION, PLACEHOLDER_ALT } from '../../utils/placeholders';

interface NewsComponentProps {
  news: Array<NewsResponseProps>;
}

import styles from './styles.module.scss';

export const NewsComponent = ({ news }: NewsComponentProps) => {
  const isDesktop = useMediaQuery({ minWidth: 620 });

  return (
    <div className={styles.newsContent}>
      {isDesktop ? (
        news?.length ? news.map((value) => (
          <DesktopNewsComponent
            key={value._id}
            id={value?._id}
            url={value?.url || PLACEHOLDER_IMAGE}
            showImage={true}
            showDate={true}
            title={value?.title || PLACEHOLDER_TITLE}
            description={value?.altText || PLACEHOLDER_DESCRIPTION}
            date={value?.updatedAt}
            alt={value?.altText || PLACEHOLDER_ALT}
          />
        )) : (
          <DesktopNewsComponent
            key={'placeholder-news'}
            id={''}
            url={PLACEHOLDER_IMAGE}
            showImage={true}
            showDate={true}
            title={PLACEHOLDER_TITLE}
            description={PLACEHOLDER_DESCRIPTION}
            date={new Date()}
            alt={PLACEHOLDER_ALT}
          />
        )
      ) : (
        <MobileNewsComponent news={news} />
      )}
    </div>
  );
};
