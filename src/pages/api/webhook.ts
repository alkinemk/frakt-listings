const rpc = `https://rpc.helius.xyz/?api-key=${process.env.HELIUS_KEY}`;

const getAsset = async (token: string) => {
  const response = await fetch(rpc, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "my-id",
      method: "getAsset",
      params: {
        id: token,
      },
    }),
  });
  const { result } = await response.json();
  return result;
};

// const { RestClient, FloorpriceBatchedRequest } = require("@hellomoon/api");

// const client = new RestClient("d9fcf68d-11eb-4dd6-bbed-7f9c8007ed65");

// client
//   .send(
//     new FloorpriceBatchedRequest({
//       // ...your params
//     })
//   )
//   .then(console.log)
//   .catch(console.error);

export default async function handler(req: any, res: any) {
  try {
    if (req.method === "POST") {
      const player_webhook: any = process.env.DISCORD_WEBHOOK_PLAYER_POINTS;
      const partner_webhook: any = process.env.DISCORD_WEBHOOK_PARTNER_POINTS;

      let webhook_data = req.body;

      let token: any = await getAsset(webhook_data[0].events.nft.nfts[0].mint);

      let playerPointsObject = token.content.metadata.attributes.find(
        (item: any) => item.trait_type === "player points"
      );

      let partnerPointsObject = token.content.metadata.attributes.find(
        (item: any) => item.trait_type === "partner points"
      );

      const playerPointsValue = playerPointsObject.value;
      const partnerPointsValue = partnerPointsObject.value;

      let listing_price = (
        webhook_data[0].events.nft.amount / 1000000000
      ).toFixed(2);

      const player_points_per_sol =
        Number(listing_price) / Number(playerPointsValue);
      const partner_points_per_sol =
        Number(listing_price) / Number(partnerPointsValue);

      console.log("title", token.content.metadata.name);
      console.log("points_per_sol", player_points_per_sol);

      if (player_points_per_sol <= 3) {
        const response = await fetch(player_webhook, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: null,
            embeds: [
              {
                title: token.content.metadata.name + " listed!",
                url: `https://www.tensor.trade/item/${webhook_data[0].events.nft.nfts[0].mint}`,
                color: 16486972,
                fields: [
                  {
                    name: " ",
                    value: " ",
                  },

                  {
                    name: " ",
                    value: " ",
                  },

                  {
                    name: ":moneybag:  Listing Price",
                    value: "**" + listing_price + " " + "SOL**",
                    inline: true,
                  },
                  {
                    name: ":date:  Listing Date",
                    value: `<t:${webhook_data[0].timestamp}:R>`,
                    inline: true,
                  },
                  {
                    name: " ",
                    value: " ",
                  },

                  {
                    name: "Player points",
                    value: playerPointsValue,
                    inline: true,
                  },
                  {
                    name: "SOL per points",
                    value: player_points_per_sol.toFixed(2),
                    inline: true,
                  },
                ],
                image: {
                  url: token.content.files[0].uri,
                },
                timestamp: new Date().toISOString(),
                footer: {
                  text: "Helius",
                  icon_url:
                    "https://assets-global.website-files.com/641a8c4cac3aee8bd266fd58/642b5b2804ea37191a59737b_favicon-32x32.png",
                },
              },
            ],
          }),
        });
        console.log(response);
      } else if (partner_points_per_sol <= 0.75) {
        const response = await fetch(partner_webhook, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: null,
            embeds: [
              {
                title: token.content.metadata.name + " listed!",
                url: `https://www.tensor.trade/item/${webhook_data[0].events.nft.nfts[0].mint}`,
                color: 16486972,
                fields: [
                  {
                    name: " ",
                    value: " ",
                  },

                  {
                    name: " ",
                    value: " ",
                  },

                  {
                    name: ":moneybag:  Listing Price",
                    value: "**" + listing_price + " " + "SOL**",
                    inline: true,
                  },
                  {
                    name: ":date:  Listing Date",
                    value: `<t:${webhook_data[0].timestamp}:R>`,
                    inline: true,
                  },
                  {
                    name: " ",
                    value: " ",
                  },

                  {
                    name: "Player points",
                    value: partnerPointsValue,
                    inline: true,
                  },
                  {
                    name: "SOL per points",
                    value: partner_points_per_sol.toFixed(2),
                    inline: true,
                  },
                ],
                image: {
                  url: token.content.files[0].uri,
                },
                timestamp: new Date().toISOString(),
                footer: {
                  text: "Helius",
                  icon_url:
                    "https://assets-global.website-files.com/641a8c4cac3aee8bd266fd58/642b5b2804ea37191a59737b_favicon-32x32.png",
                },
              },
            ],
          }),
        });
      }
      res.status(200).json("success");
    }
  } catch (err) {
    console.log(err);
  }
}
