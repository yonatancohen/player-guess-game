import { GamePipe } from './game.pipe';

describe('GamePipe', () => {
  it('create an instance', () => {
    const pipe = new GamePipe();
    expect(pipe).toBeTruthy();
  });
});
