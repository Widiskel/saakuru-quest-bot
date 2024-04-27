# Saakaru Quest Bot

Saakaru Quest Bot a tool for auto claim Saakaru daily quest.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Widiskel/mint-blockchain-forest-bot.git
```

2. Install dependencies:

```bash
cd saakaru-quest-bot
npm install
```

## Configuration

1. run `cp accounts_tmp.js accounts.js`
2. Add your Saakaru Bearer tokens to the `accounts.js` file in the following format:

```json
[
  "Bearer xxx",
  "Bearer xxx",
  ...
]
```

Note: You can obtain your MintChain API tokens by registering on the MintChain platform and retrieving them from your account settings.

### Accessing Authorization Token

To access the Authorization token required for the `accounts.js` file, follow these steps:

1. Open your web browser and go to the MintChain website.
2. Log in to your account.
3. Open the developer tools by pressing `F12` or right-clicking on the page and selecting "Inspect" or "Inspect Element".
4. Navigate to the "Network" tab.
5. Perform a request that requires authentication, such as refreshing the page or accessing a protected resource.
6. Look for the request in the list of network requests (sugested to find `refresh-token` request).
7. Click on the request to view its details.
8. In the `response` section, you should see something like this

```
{
    "code": 0,
    "data": {
        "token": "YOURTOKEN",
        "refreshToken": "YOURREFRESHTOKEN"
    },
    "timestamp": "2024-04-27T11:55:33.759050876Z"
}
```

Copy that value and paste it into the `accounts.js` file.

## Usage

To run the bot, execute the following command:

```bash
npm start
```
