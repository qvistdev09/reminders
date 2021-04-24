import { Flex } from './presentational/containers/flex';
import { useBreadcrumbs } from '../hooks/use-breadcrumbs';
import { Breadcrumb } from './presentational/breadcrumb/breadcrumb';

export const BreadcrumbRow = () => {
  const crumbs = useBreadcrumbs();
  return (
    <Flex justify='center' bg='darkenedBg' borders={['bottom']}>
      <Flex yPadding={0.35} maxWidth='appMaxWidth'>
        {crumbs.map(crumb => (
          <Breadcrumb key={crumb.link} link={crumb.link} beautifiedLink={crumb.beautifiedLink} />
        ))}
      </Flex>
    </Flex>
  );
};
