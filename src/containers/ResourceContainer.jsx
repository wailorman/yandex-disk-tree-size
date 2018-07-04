import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'compose-function';

import * as ResourceSelectors from '../selectors/resources-selectors';

import { Resource } from '../components/Resource';

export const ResourceContainerComponent = (props) => {
  const {
    resource: { name },
    childResourcesIds,
  } = props;
  return (
    <Resource name={name}>
      {childResourcesIds.map(resourceId => <ResourceContainer key={resourceId} id={resourceId} />)}
    </Resource>
  );
};

ResourceContainerComponent.propTypes = {
  resource: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  childResourcesIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};
ResourceContainerComponent.defaultProps = {};

export const mapStateToProps = (state, ownProps) => ({
  resource: ResourceSelectors.resourceSelector(ownProps.id)(state),
  childResourcesIds: ResourceSelectors.childResourcesIdsSelector(ownProps.id)(state),
});
export const mapDispatchToProps = () => ({});

export const ResourceContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(ResourceContainerComponent);
