/// <reference types="Cypress" />
import moment from 'moment';

// Fill and submit the form based on given inputs
Cypress.Commands.add('convertCurrency', (from, to, value, date = null) => {
    cy.get('[data-cy=fromCurrency]').find('input').clear().type(from);
    cy.get('[data-cy=toCurrency]').find('input').clear().type(to);
    if (date) {
        cy.get('[data-cy=date]').find('input').clear().type(date);
    }
    cy.get('[data-cy=value]').find('input').clear().type(value);
    cy.get('[data-cy=submit]').click();
})

// Get observations from Bank of Canada based on date
function getConversionRate(from, to, date) {
    return cy.request({
        method: 'GET',
        url: `https://www.bankofcanada.ca/valet/observations/FX${from}${to}?start_date=${date.format('YYYY-MM-DD')}&end_date=${date.format('YYYY-MM-DD')}`
    })
}

// Verify converted output (including conversion rate given by Bank of Canada) based on weekend or weekdays
// Output should display date, conversion rate and output value with 4 decimal digits 
Cypress.Commands.add('verifyConvertedOutput', (from, to, value, date = null) => {
    date = date ? moment(date) : moment();
    var isWeekend = (date.day() === 6) || (date.day() === 0);
    if (isWeekend) {
        cy.get('[data-cy="error"]')
            .should('contain', 'Error: No observation found for specific date');
    } else {
        getConversionRate(from, to, date).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.observations[0]).to.have.property(`FX${from}${to}`);
            var conversionRate = response.body.observations[0][`FX${from}${to}`].v;
            var calculatedAmount = conversionRate * value;
            cy.get('[data-cy="output"]')
                .should('contain', `From: ${from}`)
                .should('contain', `To: ${to}`)
                .should('contain', `Date: ${date.format('YYYY-MM-DD')}`)
                .should('contain', `Amount: ${value}`)
                .should('contain', `Series: FX${from}${to}`)
                .should('contain', `1 ${from} = ${conversionRate} ${to}`)
                .should('contain', `Final Value: ${calculatedAmount.toFixed(4)}`);    
        });
    }
})