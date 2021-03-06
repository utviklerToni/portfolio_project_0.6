import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { connect } from 'react-redux';
import formatDate from '../../utils/formateDate';
import { deleteExperience } from '../../actions/profile';

const Experience = ({ experience, deleteExperience }) => {
	const experiences = experience.map((exp) => (
		<tr key={exp._id}>
			<td>{exp.restaurant}</td>
			<td className='hide-sm'>{exp.title}</td>
			<td>
				{formatDate(exp.from)} -{' '}
				{exp.to ? formatDate(exp.to) : 'currently working here'}
			</td>
			<td>
				<button onClick={() => deleteExperience(exp._id)}>Delete</button>
			</td>
		</tr>
	));
	return (
		<Fragment>
			<h2 className='my-2'>Experience Credentials</h2>
			<table className='tborder'>
				<thead>
					<tr>
						<th>Restaurant</th>
						<th className='hide-sm'>Title</th>
						<th className='hide-sm'>Years</th>
						<th />
					</tr>
				</thead>
				<tbody>{experiences}</tbody>
			</table>
		</Fragment>
	);
};

Experience.propTypes = {
	experience: PropTypes.array.isRequired,
	deleteExperience: PropTypes.func.isRequired,
};

export default connect(null, { deleteExperience })(Experience);
