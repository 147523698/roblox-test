export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { gearName, gearCategory, gearReason, gearImage } = req.body;

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      return res.status(500).json({ message: 'Webhook URL not configured.' });
    }

    const payload = {
      embeds: [{
            title: "Nouvelle suggestion de Gear",
            description: "Une nouvelle suggestion de gear a été soumise !",
            color: 9063659,
            fields: [
              {
                name: "Nom du Gear",
                value: gearName,
                inline: true
              },
              {
                name: "Catégorie",
                value: gearCategory,
                inline: true
              },
              {
                name: "Pourquoi l'ajouter",
                value: gearReason,
                inline: false
              }
            ],
            thumbnail: {
              url: gearImage
            },
            timestamp: new Date().toISOString(),
            footer: {
              text: "Suggestion soumise via le site web"
            }
          }]
        };


    try {
      const discordResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (discordResponse.ok) {
        return res.status(200).json({ message: 'Suggestion envoyée avec succès !' });
      } else {
        const errorText = await discordResponse.text();
        console.error('Discord Webhook Error:', discordResponse.status, errorText);
        return res.status(discordResponse.status).json({ message: 'Échec de l\'envoi à Discord.' });
      }
    } catch (error) {
      console.error('Server error during webhook fetch:', error);
      return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
