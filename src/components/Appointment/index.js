import React, { useEffect } from 'react';
import 'components/Appointment/styles.scss';
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';
import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {

  const EMPTY = 'EMPTY';
  const SHOW = 'SHOW';
  const CREATE = 'CREATE';
  const SAVING = 'SAVING';
  const DELETING = 'DELETING';
  const CONFIRM = 'CONFIRM';
  const EDIT = 'EDIT';
  const ERROR_SAVE = 'ERROR_SAVE';
  const ERROR_DELETE = 'ERROR_DELETE';

  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING, true);
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(() => transition(ERROR_SAVE));
  }

  function cancel() {
    transition(DELETING, true);
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(() => transition(ERROR_DELETE, true));
  }

  const interviewer = !props.interview ? null : props.interview.interviewer.id;

  useEffect(() => {
    if (mode === EMPTY && props.interview) transition(SHOW);
    if (mode === SHOW && props.interview === null) transition(EMPTY);
  }, [mode, props.interview, transition])

  return(
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && props.interview && <Show student={props.interview.student} interviewer={props.interview.interviewer} onDelete={() => transition(CONFIRM)} onEdit={() => transition(EDIT)} />}
      {mode === CREATE && <Form interviewers={props.interviewers} onSave={save} onCancel={back} interviewer={null} />}
      {mode === EDIT && <Form interviewers={props.interviewers} onSave={save} onCancel={back} interviewer={interviewer} name={props.interview.student} />}
      {mode === SAVING && <Status message={SAVING} />}
      {mode === DELETING && <Status message={DELETING} />}
      {mode === CONFIRM && <Confirm  onCancel={back} onConfirm={cancel} message='Are you sure you would like to delete?'/>}
      {mode === ERROR_SAVE && <Error message={'Could not cancel appointment.'} onClose={back} />}
      {mode === ERROR_DELETE && <Error message={'Could not delete appointment.'} onClose={back} />}
      
    </article>
  );
  
};