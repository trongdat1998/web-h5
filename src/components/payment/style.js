export default theme => ({
    payment: {
        padding: "40px 24px",
        "& h1": {
            ...theme.typography.display5,
            fontSize: 24,
            lineHeight: "35px",
            fontWeight: "normal"
        },
        "& >p": {
            textAlign: "center",
            marginTop: 10
        }
    },
    info: {
        marginTop: 32,
        "& ul": {
            "& li": {
                marginBottom: 24,
                display: "flex",
                fontSize: 14,
                lineHeight: "28px",
                "& >span": {
                    width: 96,
                    marginRight: 8,
                    color: theme.palette.grey[800]
                },
                "& >p": {
                    flex: 1,
                    "& span": {
                        display: "block"
                    }
                },
                "& >div": {
                    flex: 1
                }
            }
        },
        "& >button": {
            ...theme.typography.button,
            marginTop: 48,
            color: theme.palette.common.white,
            minHeight: 28

        }
    },
    grey: {
        color: theme.palette.grey[500]
    },
    verfCode: {
        fontSize: 14,
        minWidth: "auto",
        padding: "0 0 0 8px"
    },
    status: {
        textAlign: "center",
        padding: "80px 0 350px",
        "& img": {
            width: 48,
            height: 48
        },
        "& h1": {
            ...theme.typography.display5,
            textAlign: "center",
            fontSize: 24,
            lineHeight: "35px",
            fontWeight: "normal",
            marginTop: 30
        }
    }
})