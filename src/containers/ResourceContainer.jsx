import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'compose-function';
import { pure } from 'recompose';

import * as ResourcesSelectors from '../selectors/resources-selectors';
import * as ResourcesActions from '../actions/resources-actions';

import { Resource } from '../components/Resource';

export const ResourceContainerComponent = (props) => {
  const {
    resource: { name, type, size },
    opened,
    childResourcesIds,
    changeCollapsedState,
  } = props;
  return (
    <Resource name={name} type={type} size={size} selected={opened} onClick={changeCollapsedState}>
      {opened
        && (childResourcesIds || []).map(resourceId => (
          <ResourceContainer key={resourceId} id={resourceId} />
        ))}
    </Resource>
  );
};

ResourceContainerComponent.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  id: PropTypes.string,
  resource: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    size: PropTypes.number,
  }).isRequired,
  opened: PropTypes.bool.isRequired,
  childResourcesIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  changeCollapsedState: PropTypes.func.isRequired,
};
ResourceContainerComponent.defaultProps = {
  id: 'root',
};

export const mapStateToProps = (state, ownProps) => ({
  resource: ResourcesSelectors.resourceSelector(ownProps.id)(state),
  opened: ResourcesSelectors.isResourceOpenedSelector(ownProps.id)(state),
  childResourcesIds: ResourcesSelectors.childResourcesIdsSelector(ownProps.id)(state),
});
export const mapDispatchToProps = (dispatch, ownProps) => ({
  changeCollapsedState: () => {
    dispatch(ResourcesActions.changeCollapsedState(ownProps.id));
  },
});

export const ResourceContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  pure,
)(ResourceContainerComponent);
