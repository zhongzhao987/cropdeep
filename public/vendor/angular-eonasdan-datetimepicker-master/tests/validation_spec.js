var moment = require('moment');

describe('validation datetimepicker test page', function () {

    var dtFormat = 'YYYY/MM/DD HH:mm';

    beforeAll(function () {
        browser.get('http://localhost:8000/examples/validation.html');
        browser.waitForAngular();
    });

    it('should be pristine at the beginning', function () {
        var input = element(by.tagName('input'));
        expect(input.getAttribute('class')).toContain('ng-pristine');
        expect(input.getAttribute('class')).not.toContain('ng-dirty');
    });

    it('should be invalid when empty', function () {
        var input = element(by.tagName('input'));
        expect(input.getAttribute('value')).toBe('');
        expect(input.getAttribute('class')).toContain('ng-invalid');
        expect(input.getAttribute('class')).toContain('ng-invalid-required');
    });

    it('should be valid when filled', function () {
        var opener = 'input-group-addon';
        element(by.className(opener)).click().click();

        var input = element(by.tagName('input'));
        expect(input.getAttribute('value')).toBe(moment().format(dtFormat));
        expect(input.getAttribute('class')).not.toContain('ng-invalid');
        expect(input.getAttribute('class')).not.toContain('ng-invalid-required');
        expect(input.getAttribute('class')).toContain('ng-valid');
        expect(input.getAttribute('class')).toContain('ng-valid-required');
    });

    it('and it should no longer be pristine', function () {
        var input = element(by.tagName('input'));
        expect(input.getAttribute('class')).not.toContain('ng-pristine');
        expect(input.getAttribute('class')).toContain('ng-dirty');
    });

    it('should be invalid again when cleared', function () {
        element(by.buttonText('Clear the time')).click();

        var input = element(by.tagName('input'));
        expect(input.getAttribute('value')).toBe('');
        expect(input.getAttribute('class')).toContain('ng-invalid');
        expect(input.getAttribute('class')).toContain('ng-invalid-required');
    });

    it('and it should remain dirty', function () {
        var input = element(by.tagName('input'));
        expect(input.getAttribute('class')).not.toContain('ng-pristine');
        expect(input.getAttribute('class')).toContain('ng-dirty');
    });

});