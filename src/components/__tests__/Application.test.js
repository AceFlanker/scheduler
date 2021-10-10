import React from "react";
import axios from 'axios';

import { render, cleanup, waitForElement, waitForElementToBeRemoved, fireEvent, prettyDOM, getByDisplayValue, getAllByTestId } from "@testing-library/react";

import { getByText, getByAltText, getByPlaceholderText, queryByText, queryByAltText } from "@testing-library/react";

import Application from "components/Application";

const url = process.env.REACT_APP_WEBSOCKET_URL;

afterEach(cleanup);

describe('Application', () => {

  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);
  
    return waitForElement(() => getByText("Monday"))
      .then(() => {
        fireEvent.click(getByText('Tuesday'));
        expect(getByText('Leopold Silvers')).toBeInTheDocument();
      });
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, 'appointment')[0];
    
    // console.log(prettyDOM(appointment));

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lydia Miller-Jones'}
    });

    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));

    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByText(appointment, 'SAVING')).toBeInTheDocument();

    // debug();

    // await waitForElementToBeRemoved(() => getByText(appointment, 'SAVING'));

    // expect(getByText(appointment, 'Lydia Miller-Jones'));

    await waitForElement(() => getByText(appointment, 'Lydia Miller-Jones'));

    // expect(getAllByTestId(container, 'day').find(day => getByText(day, 'Monday')));

    const day = getAllByTestId(container, 'day').find(day => getByText(day, 'Monday'));

    // console.log(prettyDOM(day));

    expect(getByText(day, 'no spots remaining')).toBeInTheDocument();

  });


  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async() => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, 'appointment').find(appointment => queryByText(appointment, 'Archie Cohen')
    );

    fireEvent.click(getByAltText(appointment, "Delete"));
    
    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, 'Are you sure you would like to delete?')).toBeInTheDocument;

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, 'Confirm'));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, 'DELETING')).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, 'day').find(day => getByText(day, 'Monday'));
    expect(getByText(day, '2 spots remaining')).toBeInTheDocument();

    // debug();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async() => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Click the "Edit" button on the booked appointment.
    const appointment = getAllByTestId(container, 'appointment').find(appointment => queryByText(appointment, 'Archie Cohen')
    );

    fireEvent.click(getByAltText(appointment, "Edit"));

    // 4. Enter the name "Lydia Miller-Jones" into the input with the value of "Archie Cohen".
    fireEvent.change(getByDisplayValue(appointment, 'Archie Cohen'), {
      target: { value: 'Lydia Miller-Jones'}
    });

    // 5. Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));

    // 6. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, 'Save'));

    // 7. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, 'SAVING')).toBeInTheDocument();

    // 8. Wait until the element with the text "Lydia Miller-Jones" is displayed.
    await waitForElement(() => getByText(appointment, 'Lydia Miller-Jones'));

    // 9. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    const day = getAllByTestId(container, 'day').find(day => getByText(day, 'Monday'));
    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();

    // debug();

  });

  it("shows the save error when failing to save an appointment", async() => {
  
    axios.put.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Add" button on the first empty appointment.
    const appointment = getAllByTestId(container, 'appointment')[0];
    fireEvent.click(getByAltText(appointment, "Add"));

    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lydia Miller-Jones'}
    });

    // 5. Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));

    // 6. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, 'Save'));

    // 7. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, 'SAVING')).toBeInTheDocument();

    // 8. Wait until the element with the text "Could not save appointment" is displayed.
    await waitForElement(() => getByText(appointment, 'Error'));
    expect(getByText(appointment, 'Could not cancel appointment.')).toBeInTheDocument();
    
    // 9. Check that the DayListItem with the text "Monday" also has the text "no spots remaining".
    const day = getAllByTestId(container, 'day').find(day => getByText(day, 'Monday'));
    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();

  });

  it("shows the delete error when failing to delete an existing appointment", async() => {

    axios.delete.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, 'appointment').find(appointment => queryByText(appointment, 'Archie Cohen')
    );
    fireEvent.click(getByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, 'Are you sure you would like to delete?')).toBeInTheDocument;

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, 'Confirm'));

    // 7. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, 'DELETING')).toBeInTheDocument();

    // 8. Wait until the element with the text "Could not delete appointment" is displayed.
    await waitForElement(() => getByText(appointment, 'Error'));
    expect(getByText(appointment, 'Could not delete appointment.')).toBeInTheDocument();
    
    // 9. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    const day = getAllByTestId(container, 'day').find(day => getByText(day, 'Monday'));
    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();

  });

})





