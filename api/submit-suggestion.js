export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { gearName, gearCategory, gearReason, gearImage } = req.body;

  const webhookURL = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookURL) {
    return res.status(500).json({ message: 'Webhook non défini' });
  }

  const embed = {
    title: "Nouvelle suggestion de gear",
    color: 0x8A4CEB,
    fields: [
      { name: "Nom", value: gearName, inline: true },
      { name: "Catégorie", value: gearCategory, inline: true },
      { name: "Raison", value: gearReason },
      { name: "Image", value: gearImage }
    ],
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch(webhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ message: `Erreur Discord: ${text}` });
    }

    return res.status(200).json({ message: 'Suggestion envoyée avec succès' });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de l\'envoi au webhook', error: error.message });
  }
}
