    const timeout = 15000

    // série de tests sur la page d'accueil
    describe("Tests basiques", () => {
        let page

        // vérification du chargement de la page d'accueil
        test('home', async () => {
            // charger la page d'accueil
            await page.goto('http://polr.campus-grenoble.fr')
            // attendre que l'élément <body> soit chargé
            await page.waitForSelector('body')
            // récupérer le contenu de l'élément <body>
            const html = await page.$eval('body', e => e.innerHTML)
            // vérifier que dans cet élément Body on trouve "Polr du campus"
            expect(html).toContain("Polr du campus")
        }, timeout)

        // parcours client avec about
        test('home and about', async () => {
            await page.goto('http://polr.campus-grenoble.fr')
            await page.waitForSelector('#navbar li a')
            // click sur le lien "About" de la navigation
            await page.evaluate( () => {
                Array
                    .from( document.querySelectorAll( '#navbar li a' ) )
                    .filter( el => el.textContent === 'About' )[0].click();
            });
            // on attent que l'élément ".about-contents" soit chargé
            await page.waitForSelector('.about-contents')
            // on récupère le code HTML
            const html = await page.$eval('.about-contents', e => e.innerHTML)
            // on vérifie qu'il contient la bonne chaîne de caractères
            expect(html).toContain("powered by Polr 2")
        }, timeout);
        //////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////
        
        // parcours client création d'un user et delete user en tant qu'admin
        test('Create and delete user lambda', async () => {
            var username = 'yu';
            var pw = 'yu';
            var mail = 'yu@yu.fr';
            await page.goto('http://polr.campus-grenoble.fr')
            await page.waitForSelector('nav[role="navigation"]')
            // click sur le bouton "sign up" de la navigation
            await page.evaluate( () => {
                Array
                    .from( document.querySelectorAll( 'ul li a' ) )
                    .filter( el => el.textContent === 'Sign Up' )[0].click();
            });
            // on attent que l'élément "form" soit chargé
            await page.waitForSelector('form[action="/signup"]')
            // on vérifie qu'il contient la bonne chaîne de caractères
            const html1 = await page.$eval('.container', e => e.innerHTML)
            expect(html1).toContain("Username")
            await page.type('form[action="/signup"] input[name="username"]',username)
            await page.type('form[action="/signup"] input[name="password"]',pw)
            await page.type('form[action="/signup"] input[name="email"]',mail)
            await page.$eval( 'form[action="/signup"] input[value="Register"]', el => el.click() )
            await page.screenshot({path: './tests/img/shorte24.png'});

            
            // on récupère le code HTML
            const html2 = await page.$eval('.container', e => e.innerHTML)
            
            expect(html2).toContain("Login")
            await page.goto('http://polr.campus-grenoble.fr')
            await page.waitForSelector('#navbar li a')
            await page.$eval( 'li a[data-toggle="dropdown"]', el => el.click() )

            await page.type('form[action="login"] input[name="username"]',"yo")
            await page.type('form[action="login"] input[name="password"]',"yo")
            await page.$eval( '.login-form-submit', el => el.click() )

            await page.waitForSelector('body')

            await page.$eval( '.login-name', el => el.click() )
            await page.waitForSelector('body')
            await page.evaluate( () => {
                    Array
                        .from( document.querySelectorAll( 'ul li a' ) )
                        .filter( el => el.textContent === 'Settings' )[0].click();
                });
                await page.waitFor(1000)

            await page.evaluate( () => {
                Array
                    .from( document.querySelectorAll( 'ul li a' ) )
                    .filter( el => el.textContent === 'Admin' )[0].click();
                });
            await page.type('#admin_users_table_wrapper input[type="search"]',mail)
           
            
            await page.waitFor(1000)
            await page.$eval( '#admin_users_table a.btn-danger', el => el.click() );
            await page.waitFor(1000)

            await page.screenshot({path: './tests/img/shorte23.png'});
           
        }, timeout);



        // cette fonction est lancée avant chaque test de cette
        // série de tests
        beforeAll(async () => {
            // ouvrir un onglet dans le navigateur
            page = await global.__BROWSER__.newPage()

            page.on('dialog', async dialog => {
                await dialog.accept();
            });

        }, timeout);

    })
