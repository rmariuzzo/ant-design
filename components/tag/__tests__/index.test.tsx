import React from 'react';
import Tag from '..';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { render, fireEvent } from '../../../tests/utils';

describe('Tag', () => {
  mountTest(Tag);
  mountTest(Tag.CheckableTag);
  rtlTest(Tag);
  rtlTest(Tag.CheckableTag);

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should be closable', () => {
    const onClose = jest.fn();
    const { container } = render(<Tag closable onClose={onClose} />);
    expect(container.querySelectorAll('.anticon-close').length).toBe(1);
    expect(container.querySelectorAll('.ant-tag:not(.ant-tag-hidden)').length).toBe(1);
    fireEvent.click(container.querySelectorAll('.anticon-close')[0]);
    expect(onClose).toHaveBeenCalled();
    jest.runAllTimers();
    expect(container.querySelectorAll('.ant-tag:not(.ant-tag-hidden)').length).toBe(0);
  });

  it('should not be closed when prevent default', () => {
    const onClose = (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
    };
    const { container } = render(<Tag closable onClose={onClose} />);
    expect(container.querySelectorAll('.anticon-close').length).toBe(1);
    expect(container.querySelectorAll('.ant-tag:not(.ant-tag-hidden)').length).toBe(1);
    fireEvent.click(container.querySelectorAll('.anticon-close')[0]);
    jest.runAllTimers();
    expect(container.querySelectorAll('.ant-tag:not(.ant-tag-hidden)').length).toBe(1);
  });

  it('should trigger onClick', () => {
    const onClick = jest.fn();
    const { container } = render(<Tag onClick={onClick} />);
    fireEvent.click(container.querySelectorAll('.ant-tag')[0]);
    expect(onClick).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'click',
        preventDefault: expect.any(Function),
      }),
    );
  });

  it('should trigger onClick on CheckableTag', () => {
    const onClick = jest.fn();
    const { container } = render(<Tag.CheckableTag checked={false} onClick={onClick} />);
    fireEvent.click(container.querySelectorAll('.ant-tag')[0]);
    expect(onClick).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'click',
        preventDefault: expect.any(Function),
      }),
    );
  });

  // https://github.com/ant-design/ant-design/issues/20344
  it('should not trigger onClick when click close icon', () => {
    const onClose = jest.fn();
    const onClick = jest.fn();
    const { container } = render(<Tag closable onClose={onClose} onClick={onClick} />);
    fireEvent.click(container.querySelectorAll('.anticon-close')[0]);
    expect(onClose).toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
  });

  describe('visibility', () => {
    it('can be controlled by visible with visible as initial value', () => {
      const { asFragment, rerender } = render(<Tag visible />);
      expect(asFragment().firstChild).toMatchSnapshot();
      rerender(<Tag visible={false} />);
      jest.runAllTimers();
      expect(asFragment().firstChild).toMatchSnapshot();
      rerender(<Tag visible />);
      jest.runAllTimers();
      expect(asFragment().firstChild).toMatchSnapshot();
    });

    it('can be controlled by visible with hidden as initial value', () => {
      const { asFragment, rerender } = render(<Tag visible={false} />);
      expect(asFragment().firstChild).toMatchSnapshot();
      rerender(<Tag visible />);
      jest.runAllTimers();
      expect(asFragment().firstChild).toMatchSnapshot();
      rerender(<Tag visible={false} />);
      jest.runAllTimers();
      expect(asFragment().firstChild).toMatchSnapshot();
    });
  });

  describe('CheckableTag', () => {
    it('support onChange', () => {
      const onChange = jest.fn();
      const { container } = render(<Tag.CheckableTag checked={false} onChange={onChange} />);
      fireEvent.click(container.querySelectorAll('.ant-tag')[0]);
      expect(onChange).toHaveBeenCalledWith(true);
    });
  });
});
