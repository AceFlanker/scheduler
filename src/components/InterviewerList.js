import React from 'react';
import PropTypes from 'prop-types';
import 'components/InterviewerList.scss';
import InterviewerListItem from './InterviewerListItem';

export default function InterviewerList(props) {

  const { interviewers } = props;
  const interviewer = interviewers.map(interviewer => <InterviewerListItem 
    key={interviewer.id}
    id={interviewer.id}
    name={interviewer.name}
    avatar={interviewer.avatar}
    selected={props.value === interviewer.id}
    setInterviewer={() => props.setInterviewer(interviewer.id)}
    />
  );

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {interviewer}
      </ul>
    </section>
  );
};

InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired
};