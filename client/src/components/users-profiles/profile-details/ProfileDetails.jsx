import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../../layout/Spinner';
import { getProfileByID } from '../../../actions/profile';
import { Link } from 'react-router-dom';

const ProfileDetails = ({
	getProfileByID,
	profile: { profile, loading },
	auth,
	match,
}) => {
	useEffect(() => {
		getProfileByID(match.params.id);
	}, [getProfileByID, match.params.id]);

	return (
		<Fragment>
			{profile === null || loading ? (
				<Spinner />
			) : (
				<Fragment>
					<Link to='/profiles'>Back to Profiles</Link>
					{auth.isAuthenticated &&
						auth.loading === false &&
						auth.user._id === profile.user._id && (
							<Link to='/edit-profile'>Edit Profile</Link>
						)}
				</Fragment>
			)}
		</Fragment>
	);
};

ProfileDetails.propTypes = {
	getProfileByID: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	profile: state.profile,
	auth: state.auth,
});

export default connect(mapStateToProps, { getProfileByID })(ProfileDetails);