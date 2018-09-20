import React from 'react';

import { shallow, mount } from 'enzyme';

import FormEdit from './FormEdit';

describe('FormEdit', () => {
  let props;

  beforeEach(() => {
    props = {
      item: {
        value: 'someValue',
        id: '0',
        completed: false,
      },
      handleEditItem: jest.fn(),
      handleCancelEditItem: jest.fn(),
    };
  });

  it('verify if form submission is being handled', () => {
    const component = shallow(<FormEdit {...props} />);

    component.find('form').simulate('submit', { preventDefault: jest.fn() });

    expect(props.handleEditItem).toHaveBeenCalledWith(props.item);
    expect(props.handleCancelEditItem).not.toHaveBeenCalled();
  });

  it('verify if form submission is handled with a new input field value', () => {
    const value = 'someNewValue';

    const component = shallow(<FormEdit {...props} />);

    component.find('#input-edit-todo-item').simulate('change', { target: { value } });

    expect(component.state('itemValue')).toBe(value);

    component.find('form').simulate('submit', { preventDefault: jest.fn() });

    expect(props.handleEditItem).toHaveBeenCalledWith({ ...props.item, value });
    expect(props.handleCancelEditItem).not.toHaveBeenCalled();
  });

  it('verify if handleCancelEditItem prop is called when button is pressed', () => {
    const component = shallow(<FormEdit {...props} />);

    component.find('#cancel-edit-todo-item').simulate('click');

    expect(props.handleCancelEditItem).toHaveBeenCalled();
    expect(props.handleEditItem).not.toHaveBeenCalledWith();
  });

  it('verify if handleCancelEditItem prop is called when `escape` key is pressed', () => {
    const escapeEv = {
      code: 'Escape',
    };

    const eventMap = {
      keyup: null,
    };

    window.addEventListener = jest.fn((event, cb) => {
      eventMap[event] = cb;
    });

    const component = mount(<FormEdit {...props} />);
    eventMap.keyup(escapeEv);

    expect(props.handleCancelEditItem).toHaveBeenCalledWith(escapeEv);
    expect(props.handleEditItem).not.toHaveBeenCalled();
  });
});
