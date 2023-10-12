using System.Diagnostics;
using System.Text.RegularExpressions;
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;


namespace TestProject1;

[Parallelizable(ParallelScope.Self)]
[TestFixture]
public class Tests : PageTest
{
    [Test]
    public async Task CanFieldBeFound()

    {
        await Page.GotoAsync("http://localhost:5000/boxes");

        var inputField = Page.GetByLabel("Search");

        await Expect(inputField).ToBeEmptyAsync();
        await Expect(inputField).ToBeEditableAsync();
    }


    [Test]
    public async Task SearchFunctionTest()
    {
        
        await Page.GotoAsync("http://localhost:5000/boxes");

        await Page.GetByLabel("Search").ClickAsync();

        await Page.GetByLabel("Search").FillAsync("Flat");

        await Page.Locator("#select-label").ClickAsync();

        await Page.GetByRole(AriaRole.Radio, new() { Name = "Cardboard" }).ClickAsync();

        await Page.GetByRole(AriaRole.Button, new() { Name = "OK" }).ClickAsync();

        await Page.GetByRole(AriaRole.Button, new() { Name = "Search" }).ClickAsync();
        
        await Task.Delay(3000);

        Assert.That(Page.GetByTestId("card_Flat higher box").GetByRole(AriaRole.Img), Is.Not.Null);
        Assert.That(Page.GetByTestId("card_Flat box").GetByRole(AriaRole.Img), Is.Not.Null);

    }
    
    [Test]
    public async Task CreateBoxTest()
    {
        await Page.GotoAsync("http://localhost:5000/boxes");
        
        await Page.Locator(".ios > .ios > .icon-inner > .ionicon > path").First.ClickAsync();

        await Page.GetByTestId("createBox").GetByRole(AriaRole.Img).Nth(1).ClickAsync();

        await Page.GetByTestId("titleInput").Locator("label").ClickAsync();

        await Page.GetByLabel("The name of the new box: ").FillAsync("Test1");

        await Page.GetByLabel("The name of the new box: ").PressAsync("Tab");

        await Page.GetByLabel("Height: ").FillAsync("40");

        await Page.GetByLabel("Width: ").FillAsync("40");

        await Page.GetByLabel("Lenght: ").FillAsync("40");

        await Page.GetByLabel("Cost price: ").FillAsync("200");

        await Page.GetByLabel("Type: ").FillAsync("Wood");

        await Page.GetByLabel("Box image url: ").FillAsync("https://cdn4.jysk.com/getimage/wd2.medium/82289");

        await Page.GetByRole(AriaRole.Button, new() { Name = "send" }).ClickAsync();
        
        Assert.That(Page.GetByTestId("card_Test1").Locator("ion-toolbar div").Nth(1), Is.Not.Null);

    }
}