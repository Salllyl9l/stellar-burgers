describe('Общий тест конструктора и модальных окон', () => {
  const MODAL = '#modals';
  const MODAL_CLOSE_BUTTON = `${MODAL} button`;
  beforeEach(() => {
      //Использую метод cy.intercept() для перехвата GET и POST запросов к API
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('ingredients');
      cy.intercept('GET', 'api/orders/all', { fixture: 'newOrder.json' }).as('newOrder');
      cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('user');
      cy.intercept('POST','api/orders', { fixture: 'orders.json' }).as('orders');
      //выполняю подгрузку данных из фикстур
      cy.fixture('ingredients.json');
      cy.fixture('newOrder.json');
      cy.fixture('user.json');
      cy.fixture('orders.json');
      //устанавливаю куки с имитацией авторизации пользователя
      cy.setCookie('accessToken', 'mockAccessTokenDavid');
      localStorage.setItem('refreshToken', 'mockTokenForDavid');
      //переход на главную страницу
      cy.visit('/');
      //ожидаю получения данных, важно, чтобы он был после cy.visit('/');
      cy.wait('@ingredients');
      cy.wait('@user');
  });

  // очищаю куки и хранилище поле тестов
  afterEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
  });

  describe('Тесты модальных окон', function () {
    beforeEach(function () {
    //Открываю модальное окно перед тестами
    cy.get('ul').find('[href^="/ingredients"]').first().click();
    });
    it('тест открытия модального окна и добавление ингредиента из списка ингредиентов в конструктор', function () {
    cy.get('#modals').within(() => {
    cy.get('h3').contains('Детали ингредиента').should('be.visible');
    cy.get('h3').contains('Краторная булка N-200i').should('exist');
    //состав
    cy.get('p').contains('Калории, ккал').next().should('not.be.empty');
    cy.get('p').contains('Белки, г').next().should('not.be.empty');
    cy.get('p').contains('Жиры, г').next().should('not.be.empty');
    cy.get('p').contains('Углеводы, г').next().should('not.be.empty');
    });
    })
    it('тест закрытия модального окна с описанием ингредиента нажатием по крестику', function () {
    cy.get('#modals').find('button').click();
    cy.get('#modals').should('be.empty');
    cy.get('div').contains('Детали ингредиента').should('not.exist');
    });

    it('тест закрытия модального окна с описанием ингредиента нажатием на esc', function () {
    cy.get('body').type('{esc}');
    cy.get('#modals').should('be.empty');
    cy.get('div').contains('Детали ингредиента').should('not.exist');
    });

    it('тест закрытия модального окна с описанием ингредиента нажатием на оверлей', function () {
    cy.get('#modals').children().last().click('right', { force: true });
    cy.get('#modals').should('be.empty');
    cy.get('div').contains('Детали ингредиента').should('not.exist');
    });
  });

  describe('Тест оформления заказа', function () {
    const userEmail = 'salllyl9l18@yandex.ru';
    const userPassword = 'war3mod';
    const userName = 'Aleksandra';
  
    before(function() {
      // Авторизация перед всеми тестами
      cy.visit('/login');
      
      // Проверяем, что мы на странице входа
      cy.contains('Вход').should('exist');
      
      // Заполняем форму входа (используем атрибуты name как селекторы)
      cy.get('input[name=email]').type(userEmail);
      cy.get('input[name=password]').type(userPassword);
      cy.get('button').contains('Войти').click();
      
      // Ждем завершения авторизации (проверяем переход на главную)
      cy.url().should('include', '/');
    });
  
    it('Проверка авторизации пользователя', function () {
      cy.visit('/profile');
      
      // Проверяем данные профиля
      cy.get('input[name=name]').should('have.value', userName);
      cy.get('input[name=email]').should('have.value', userEmail);
    });
  
    it('Тест процесса добавления ингредиентов и оформления заказа', function () {
      cy.visit('/');
      
        // Ждем загрузки ингредиентов (более универсальная проверка)
        cy.get('section').contains('Булки').should('exist');
        cy.get('section').contains('Соусы').should('exist');
        cy.get('section').contains('Начинки').should('exist');

        // Добавляем булку (новый подход)
        cy.get('[data-cy="burger-constructor"]').contains('Краторная булка N-200i').should('not.exist');
        cy.get('h3').contains('Булки').next('ul').children().first().contains('Добавить').click();
        cy.get('[data-cy="burger-constructor"]').contains('Краторная булка N-200i').should('exist');
        
        // Добавляем начинку
        cy.get('[data-cy="burger-constructor"]').contains('Биокотлета из марсианской Магнолии').should('not.exist');
        cy.get('h3').contains('Начинки').next('ul').children().first().contains('Добавить').click();
        cy.get('[data-cy="burger-constructor"]').contains('Биокотлета из марсианской Магнолии').should('exist');
        
        // Добавляем соус
        cy.get('[data-cy="burger-constructor"]').contains('Соус Spicy-X').should('not.exist');
        cy.get('h3').contains('Соусы').next('ul').children().first().contains('Добавить').click();
        cy.get('[data-cy="burger-constructor"]').contains('Соус Spicy-X').should('exist');
        
        // Проверяем заполненность конструктора
        cy.contains('Выберите булки').should('not.exist');
        cy.contains('Выберите начинку').should('not.exist');
        
        // Мокаем ответ сервера
        cy.intercept('POST', 'api/orders', {
            statusCode: 200,
            body: { success: true, name: 'Space burger', order: { number: 12345 } }
        }).as('orderRequest');
        
        // Оформляем заказ
        cy.get('button').contains('Оформить заказ').click();
        
        // Проверяем модальное окно
        cy.get('[data-cy="modal"]').find('h2').contains('12345').should('exist');
        // Закрываем модальное окно
        cy.get(MODAL_CLOSE_BUTTON).click();
        cy.get(MODAL).should('be.empty');
    });

    after(function() {
        cy.clearCookies();
        cy.clearLocalStorage();
    });
  });
})