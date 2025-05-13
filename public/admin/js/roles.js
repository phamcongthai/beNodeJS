const table = document.querySelector("[table-permissions]");
if (table) {
    const button = document.querySelector("[btn-submit]");
    if (button) {
        button.addEventListener("click", (event) => {
            const tr = table.querySelectorAll("[data-name]");
            let permissionsObj = [];
            if (tr) {
                tr.forEach((item) => {
                    const name = item.getAttribute("data-name");
                    if (name === "id") {
                        const inputs = item.querySelectorAll("input");
                        inputs.forEach((input) => {
                            permissionsObj.push({
                                id: input.value,
                                permissions: []
                            })
                        })
                    } else {
                        const inputs = item.querySelectorAll("input");

                        inputs.forEach((input, index) => {
                            if (input.checked === true) {
                                permissionsObj[index].permissions.push(item.getAttribute("data-name"));

                            }
                        })


                    }
                })

            }
            const inputResult = document.querySelector("[input-result]");
            inputResult.value = JSON.stringify(permissionsObj);
            const form = document.querySelector("#form-change-permissions");
            form.submit();

        })

    }
}