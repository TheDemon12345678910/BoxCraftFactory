import {expect, test} from "@playwright/test";


const myInlineData = [
    {boxTitle: "aaksljdlasjk"+Math.random()*21389, boxHeight: Math.random()*21389, boxWidth: Math.random()*21389, boxLength: Math.random()*21389, boxPrice: Math.random()*21389, boxType: "Cardboard", boxImgUrl: "https://picsum.photos/"+Math.floor(Math.random()*42)+1, testNumber: 1},
    {boxTitle: "aaksljdlasjk"+Math.random()*21389, boxHeight: Math.random()*21389, boxWidth: Math.random()*21389, boxLength: Math.random()*21389, boxPrice: Math.random()*21389, boxType: "Steel", boxImgUrl: "https://picsum.photos/"+Math.floor(Math.random()*42)+1, testNumber: 2}
]

for (const box of myInlineData) {
    test('client side validation should make button disabled, test number: '+box.testNumber, async ({page}) => {
        await page.goto('/');
        await page.getByTestId('createBox').click();
        await page.getByTestId('titleInput')
            .locator('label')
            .locator('input')
            .fill(box.boxTitle);
        await page.getByTestId('boxHeightInput')
            .locator('label')
            .locator('input')
            .fill(box.boxHeight)
        const button = await page.getByTestId('submit');
        await expect(button).toHaveAttribute('disabled', '');
    })
}





const myInlineDataSuccess = [
    {boxTitle: "aaksljdlasjk"+Math.random()*21389, boxHeight: Math.random()*21389, boxWidth: Math.random()*21389, boxLength: Math.random()*21389, boxPrice: Math.random()*21389, boxType: "Cardboard", boxImgUrl: "https://picsum.photos/"+Math.floor(Math.random()*42)+1, testNumber: 1},
    {boxTitle: "aaksljdlasjk"+Math.random()*21389, boxHeight: Math.random()*21389, boxWidth: Math.random()*21389, boxLength: Math.random()*21389, boxPrice: Math.random()*21389, boxType: "Steel", boxImgUrl: "https://picsum.photos/"+Math.floor(Math.random()*42)+1, testNumber: 2}
]

for (const box of myInlineDataSuccess) {
    test('successfully should be able to create a box, test number: '+box.testNumber, async ({page}) => {
        await page.goto('/');
        await page.getByTestId('createBox').click();
        await page.getByTestId('titleInput')
            .locator('label')
            .locator('input')
            .fill(box.boxTitle);
        await page.getByTestId('boxHeightInput')
            .locator('label')
            .locator('input')
            .fill(box.boxHeight)
        await page.getByTestId('boxWidthInput')
            .locator('label')
            .locator('input')
            .fill(box.boxWidth)
        await page.getByTestId('boxLengthInput')
            .locator('label')
            .locator('input')
            .fill(box.boxLength)
        await page.getByTestId('boxPriceInput')
            .locator('label')
            .locator('input')
            .fill(box.boxPrice)
        await page.getByTestId('boxTypeInput')
            .locator('label')
            .locator('input')
            .fill(box.boxType)
        await page.getByTestId('boxImgUrlInput')
            .locator('label')
            .locator('input')
            .fill(box.boxImgUrl)
        const promise = page.waitForResponse('http://localhost:5000/api/boxes');
        await page.getByTestId('submit').click();
        const resolved = await promise;
        await expect(resolved.status()).toEqual(201);
        const boxCard = await page.getByTestId('card_'+ box.boxTitle);
        await expect(boxCard).toBeVisible();
    })
}

