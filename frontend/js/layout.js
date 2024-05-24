const API_URL = "http://localhost:8000/api";
const TOKEN = localStorage.getItem('token');

function checkAdmin() {
    return fetch(`${API_URL}/me/`, {
        headers: {
            'Authorization': `Token ${TOKEN}`
        }
    })
    .then(response => response.json())
    .then(data => data.is_staff) // Kullanıcının admin olup olmadığını döner
    .catch(error => {
        console.error('Error fetching user info:', error);
        return false; // Hata durumunda admin olmadığını varsayar
    });
}

async function createlayout() {
    let header;

    if (TOKEN != null) {
        const isAdmin = await checkAdmin();

        header = `
        <div class="totopshow">
            <a href="#" class="back-to-top"><img alt="Back to Top" src="images/gototop0.png" /></a>
        </div><!-- totopshow -->
        <div class="margin_collapsetop"></div>
        <div id="ttr_menu">
            <div class="margin_collapsetop"></div>
            <nav class="navbar-default navbar-expand-md navbar">
                <div id="ttr_menu_inner_in">
                    <div class="ttr_menu_element_alignment container">
                        <div class="ttr_images_container">
                            <div class="ttr_menu_logo">
                                <a href="" target="_self">
                                    <img src="menulogo.png" alt="menuimage" class="" />
                                </a>
                            </div>
                        </div>
                        <div id="navigationmenu">
                            <div class="navbar-header">
                                <button id="nav-expander" data-target=".navbar-collapse" data-toggle="collapse"
                                    class="navbar-toggle" type="button">
                                    <span class="ttr_menu_toggle_button">
                                        <span class="sr-only">
                                        </span>
                                        <span class="icon-bar navbar-toggler-icon">
                                        </span>
                                        <span class="icon-bar navbar-toggler-icon">
                                        </span>
                                        <span class="icon-bar navbar-toggler-icon">
                                        </span>
                                    </span>
                                    <span class="ttr_menu_button_text">
                                        Menu
                                    </span>
                                </button>
                            </div>
                            <div class="menu-center collapse navbar-collapse">
                                <ul class="ttr_menu_items nav navbar-nav navbar-right">
                                    <li class="ttr_menu_items_parent dropdown active"><a href="index.html"
                                            class="ttr_menu_items_parent_link_active"><span
                                                class="menuchildicon"></span>Home</a>
                                        <hr class="horiz_separator" />
                                    </li>
                                    <li class="ttr_menu_items_parent dropdown"><a href="uavs.html"
                                            class="ttr_menu_items_parent_link"><span
                                                class="menuchildicon"></span>UAVS</a>
                                        <hr class="horiz_separator" />
                                    </li>`;

        if (isAdmin) {
            header += `<li class="ttr_menu_items_parent dropdown"><a href="admin.html"
                                class="ttr_menu_items_parent_link"><span
                                    class="menuchildicon"></span>Panel</a>
                            <hr class="horiz_separator" />
                        </li>`;
        }
        header += `     <li class="ttr_menu_items_parent dropdown"><a href="rentals.html"
                                class="ttr_menu_items_parent_link"><span
                                    class="menuchildicon"></span>Rentals</a>
                            <hr class="horiz_separator" />
                        </li>`;

        header += `
                            <li class="ttr_menu_items_parent dropdown"><a onclick="logout();"
                                    class="ttr_menu_items_parent_link"><span
                                        class="menuchildicon"></span>Logout</a>
                            </li> <!-- main menu list closing -->
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    </div>`;
    } else {
        header = `
        <div class="totopshow">
            <a href="#" class="back-to-top"><img alt="Back to Top" src="images/gototop0.png" /></a>
        </div><!-- totopshow -->
        <div class="margin_collapsetop"></div>
        <div id="ttr_menu">
            <div class="margin_collapsetop"></div>
            <nav class="navbar-default navbar-expand-md navbar">
                <div id="ttr_menu_inner_in">
                    <div class="ttr_menu_element_alignment container">
                        <div class="ttr_images_container">
                            <div class="ttr_menu_logo">
                                <a href="" target="_self">
                                    <img src="menulogo.png" alt="menuimage" class="" />
                                </a>
                            </div>
                        </div>
                        <div id="navigationmenu">
                            <div class="navbar-header">
                                <button id="nav-expander" data-target=".navbar-collapse" data-toggle="collapse"
                                    class="navbar-toggle" type="button">
                                    <span class="ttr_menu_toggle_button">
                                        <span class="sr-only">
                                        </span>
                                        <span class="icon-bar navbar-toggler-icon">
                                        </span>
                                        <span class="icon-bar navbar-toggler-icon">
                                        </span>
                                        <span class="icon-bar navbar-toggler-icon">
                                        </span>
                                    </span>
                                    <span class="ttr_menu_button_text">
                                        Menu
                                    </span>
                                </button>
                            </div>
                            <div class="menu-center collapse navbar-collapse">
                                <ul class="ttr_menu_items nav navbar-nav navbar-right">
                                    <li class="ttr_menu_items_parent dropdown active"><a href="index.html"
                                            class="ttr_menu_items_parent_link_active"><span
                                                class="menuchildicon"></span>Home</a>
                                        <hr class="horiz_separator" />
                                    </li>
                                    <li class="ttr_menu_items_parent dropdown"><a href="uavs.html"
                                            class="ttr_menu_items_parent_link"><span
                                                class="menuchildicon"></span>UAVS</a>
                                        <hr class="horiz_separator" />
                                    </li>
                                    <li class="ttr_menu_items_parent dropdown"><a href="login.html"
                                            class="ttr_menu_items_parent_link"><span
                                                class="menuchildicon"></span>Login</a>
                                    </li> <!-- main menu list closing -->
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>`;
    }
    
    var footer = `
    <footer id="ttr_footer">
        <div class="margin_collapsetop"></div>
        <div id="ttr_footer_inner">
            <div class="ttr_footer_bottom_footer">
                <div class="ttr_footer_bottom_footer_inner">
                    <div class="ttr_footer_element_alignment container">
                    </div>
                    <div id="ttr_footer_designed_by_links">
                        <a href="https://templatetoaster.com" target="_self">
                            Website
                        </a>
                        <span id="ttr_footer_designed_by">
                            Designed With TemplateToaster
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </footer>`;

    // DOM'a ekle
    document.body.insertAdjacentHTML("afterbegin", header);
    document.body.insertAdjacentHTML("beforeend", footer);
}

function layout() {
    createlayout();
}

