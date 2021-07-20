import {
  PropertyBasedScopesFilter,
  ScopesConfiguration,
} from './property-based.scopes-filter';

describe('The generic property-based scopes filter', () => {
  type TestScope = 'yolo' | 'croute' | 'moustaki';
  const payload = {
    name: 'Jean',
    surname: 'Croute',
    birthdate: {
      day: 3,
      year: 1991,
    },
  };
  const scopesConfiguration: ScopesConfiguration<TestScope> = {
    yolo: ['name'],
    croute: ['surname'],
    moustaki: ['birthdate.day'],
  };
  const {filter} = new PropertyBasedScopesFilter(scopesConfiguration);

  it('filters provided data based on scopes configuration', () => {
    expect(filter(['croute'], payload)).toEqual({
      surname: payload.surname,
    });
  });

  it('returns an empty object when no scope is provided', () => {
    expect(filter([], payload)).toEqual({});
  });

  it('filters nested properties', () => {
    expect(filter(['moustaki'], payload)).toEqual({
      birthdate: {
        day: payload.birthdate.day,
      },
    });
  });
});
