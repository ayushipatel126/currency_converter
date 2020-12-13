/// <reference types="Cypress" />
import moment from 'moment';

Cypress.Commands.add('convertCurrency', (from, to, value, date = null) => {
    cy.get('[data-cy=fromCurrency]').find('input').clear().type(from)
    cy.get('[data-cy=toCurrency]').find('input').clear().type(to)
    if (date) {
        cy.get('[data-cy=date]').find('input').clear().type(date)
    }
    cy.get('[data-cy=value]').find('input').clear().type(value)
    cy.get('[data-cy=submit]').click()
})

Cypress.Commands.add('verifyConvertedOutput', (from, to, value, date = null) => {
    var dateObj = date ? moment(date) : moment();
    var isWeekend = (dateObj.day() === 6) || (dateObj.day() === 0);
    if (isWeekend) {
        cy.get('[data-cy="error"]')
            .should('contain', 'Error: No observation found for specific date')
    } else {
        cy.get('[data-cy="output"]')
            .should('contain', `From: ${from}`)
            .should('contain', `To: ${to}`)
            .should('contain', `Date: ${dateObj.format('YYYY-MM-DD')}`)
            .should('contain', `Amount: ${value}`)
            .should('contain', `Series: FX${from}${to}`)         
    }
})