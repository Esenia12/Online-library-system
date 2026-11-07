import AuthService from './AuthService';

describe('AuthService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('getCurrentUser returns null when nothing stored', () => {
    expect(AuthService.getCurrentUser()).toBeNull();
  });

  test('logout clears storage', () => {
    localStorage.setItem('user', JSON.stringify({ id: 1 }));
    AuthService.logout();
    expect(localStorage.getItem('user')).toBeNull();
  });

  test('getCurrentUser returns parsed user', () => {
    localStorage.setItem('user', JSON.stringify({ id: 7, username: 'test' }));
    expect(AuthService.getCurrentUser()).toEqual({ id: 7, username: 'test' });
  });
});