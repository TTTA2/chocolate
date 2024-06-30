const global_settings = {

    turn1: "HL",
    turn2: "CU",

    templates: [
        {
            label: "ラベル",
            body: [
                {
                    turn: "HL",
                    text: "test1",
                },

                {
                    turn: "CU",
                    text: "test2",
                },

                {
                    turn: "HL",
                    text: "test3\ntest3lf",
                },

                {
                    turn: "CU",
                    text: "test4",
                }
            ],
        }
    ],

    snippets: [

        {
            keyword: "/スニペット1",
            detail: "詳細です 1",
            text: "これに置き換えられます"
        },

        {
            keyword: "/スニペット2",
            detail: "詳細です 2",
            text: "これに置き換えられます 2"
        },

        {
            keyword: "/スニペット3",
            detail: "詳細です 3",
            text: "これに置き換えられます 3"
        }

    ]

}