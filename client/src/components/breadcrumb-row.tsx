import { Row } from './presentational/containers/row';
import { InnerMaxWidth } from './presentational/containers/inner-max-width';
import { useBreadcrumbs } from '../hooks/use-breadcrumbs';
import { Breadcrumb } from './presentational/breadcrumb/breadcrumb';

export const BreadcrumbRow = () => {
  const crumbs = useBreadcrumbs();
  return (
    <Row justify='centered' bg='darkenedBg' borders={['bottom']}>
      <InnerMaxWidth yPadding='0.35rem'>
        {crumbs.map(crumb => (
          <Breadcrumb key={crumb.link} link={crumb.link} beautifiedLink={crumb.beautifiedLink} />
        ))}
      </InnerMaxWidth>
    </Row>
  );
};
