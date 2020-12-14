describe("Currency Convertor", () => {

    let currencies = [];

    before(() => {
        cy.fixture('foreignCurrencies')
            .then((foreignCurrencies) => {
                currencies = foreignCurrencies;
            })
    })

    beforeEach(() => {
        cy.visit('/');
    })

    // Convert foreign currencies to canadian dollars based on currency code
    it("should convert foreign currencies to canadian dollars with date-weekday", () => {
        currencies.forEach(currency => {
            cy.convertCurrency(currency, 'CAD', 5, '2020-12-11');
            cy.verifyConvertedOutput(currency, 'CAD', 5, '2020-12-11');
        });
    })

    it("should convert foreign currencies to canadian dollars with date-weekend", () => {
        currencies.forEach(currency => {
            cy.convertCurrency(currency, 'CAD', 5, '2020-12-12');
            cy.verifyConvertedOutput(currency, 'CAD', 5, '2020-12-12');
        });
    })

    it("should convert foreign currencies to canadian dollars with date-holiday", () => {
        currencies.forEach(currency => {
            cy.convertCurrency(currency, 'CAD', 5, '2020-01-01');
            cy.get('[data-cy="error"]')
            .should('contain', 'Error: No observation found for specific date');
        });
    })

    it("should convert foreign currencies to canadian dollars without date", () => {
        currencies.forEach(currency => {
            cy.convertCurrency(currency, 'CAD', 5);
            cy.verifyConvertedOutput(currency, 'CAD', 5);
        });
    })

    // Convert canadain dollars to foreign currencies based on currency code
    it("should convert canadian dollars to foreign currencies with date-weekday", () => {
        currencies.forEach(currency => {
            cy.convertCurrency('CAD', currency, 5, '2020-12-11');
            cy.verifyConvertedOutput('CAD', currency, 5, '2020-12-11');
        });
    })

    it("should convert canadian dollars to foreign currencies with date-weekend", () => {
        currencies.forEach(currency => {
            cy.convertCurrency('CAD', currency, 5, '2020-12-12');
            cy.verifyConvertedOutput('CAD', currency, 5, '2020-12-12');
        });
    })

    it("should convert canadian dollars to foreign currencies with date-holiday", () => {
        currencies.forEach(currency => {
            cy.convertCurrency('CAD', currency, 5, '2020-01-01');
            cy.get('[data-cy="error"]')
            .should('contain', 'Error: No observation found for specific date');
        });
    })

    it("should convert canadian dollars to foreign currencies without date", () => {
        currencies.forEach(currency => {
            cy.convertCurrency('CAD', currency, 5);
            cy.verifyConvertedOutput('CAD', currency, 5);
        });
    })

})
