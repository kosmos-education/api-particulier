import {Request, Response} from 'express';
// eslint-disable-next-line node/no-unpublished-import
import {mock} from 'jest-mock-extended';
import {z} from 'zod';
import {inputValidationMiddlewareBuilder} from 'src/presentation/middlewares/input-validation.middleware';

describe('The input validation middleware', () => {
  const middleware = inputValidationMiddlewareBuilder(
    z.object({
      yolo: z.string(),
    })
  );
  it('checks for the API key', async () => {
    const req = {
      header: jest.fn(),
    } as unknown as Request;
    const res = mock<Response>();
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0].format()).toEqual({_errors: ['Required']});
  });

  it('checks for input correctness', async () => {
    const req = {
      header: jest.fn().mockReturnValue('The api key'),
      query: {
        croute: 'yolo',
      },
    } as unknown as Request;
    const res = mock<Response>();
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0].format()).toMatchObject({
      yolo: {_errors: ['Required']},
    });
  });

  it('passes when everything is ok', async () => {
    const req = {
      header: jest.fn().mockReturnValue('The api key'),
      query: {
        yolo: 'croute',
      },
    } as unknown as Request;
    const res = mock<Response>();
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).not.toHaveBeenCalledWith(expect.anything());
  });
});