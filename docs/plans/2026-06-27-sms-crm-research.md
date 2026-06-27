# SMS/Text Messaging Options for CRM — Research
> Date: 2026-06-27
> Goal: Enable AI agents to send SMS to CRM contacts autonomously
> Target volume: ~10-50 SMS/day

---

## 1. Twilio Free Trial

| Attribute | Details |
|-----------|---------|
| **Cost** | Free trial credit (~$15) on signup; no credit card required to start |
| **Paid pricing** | $0.0075/SMS outbound + $0.0035 carrier fee ≈ **$0.011/message** |
| **Phone number** | 1 free trial long code included |
| **API quality** | ★★★★★ — Gold standard REST API. SDKs for every language (Python, Node, Go, etc.) |
| **Inbound + Outbound** | ✅ Both supported with webhooks |
| **US/International** | 🌍 180+ countries |
| **Reliability** | ★★★★★ — Industry leader |
| **Ease of integration** | ★★★★★ — 5 minutes to first message |
| **Limitations (trial)** | Can only send to verified numbers (you must verify each recipient). Trial credits expire. Must upgrade to remove restrictions. |
| **10DLC requirement** | For production US SMS, A2P 10DLC registration required (adds complexity + one-time fees) |

**Verdict:** Best API, but trial is very restricted. Paid is ~$0.011/msg → 50 msgs/day = ~$16.50/month.

---

## 2. Textbelt ⭐ RECOMMENDED FOR BOOTSTRAPPING

| Attribute | Details |
|-----------|---------|
| **Cost** | **1 free SMS/day** (no API key needed, use `key=textbelt`) |
| **Paid pricing** | $0.04/SMS with API key (no subscription) — or self-host open source |
| **API quality** | ★★★★☆ — Dead simple REST: `POST https://textbelt.com/text` |
| **Inbound + Outbound** | ✅ Outbound free tier + paid inbound via `replyWebhookUrl` |
| **US/International** | 🇺🇸 US-only for free tier; paid supports international |
| **Reliability** | ★★★☆☆ — Uses email gateways under the hood for free tier (less reliable) |
| **Ease of integration** | ★★★★★ — Simplest API possible. One cURL command. |
| **Open source** | ✅ Self-hostable at [github.com/typpo/textbelt](https://github.com/typpo/textbelt) — uses email-to-SMS gateways |

**Example:**
```bash
curl -X POST https://textbelt.com/text \
  --data-urlencode phone='5555555555' \
  --data-urlencode message='Hello from AI agent!' \
  -d key=textbelt
```

**Verdict:** Free tier (1/day) is too limited for CRM. **Self-hosted version** is the real play — unlimited free SMS via email gateways.

---

## 3. Email-to-SMS Gateways ⭐⭐ FREE & SCALABLE (Self-Hosted)

| Carrier | Gateway Address |
|---------|----------------|
| **T-Mobile / Mint / MetroPCS** | `{number}@tmomail.net` |
| **Verizon** | `{number}@vtext.com` |
| **AT&T / Cricket** | `{number}@txt.att.net` |
| **Sprint / T-Mobile (legacy)** | `{number}@messaging.sprintpcs.com` |
| **US Cellular** | `{number}@email.uscc.net` |
| **Boost Mobile** | `{number}@myboostmobile.com` |
| **Google Fi** | `{number}@msg.fi.google.com` |

| Attribute | Details |
|-----------|---------|
| **Cost** | **FREE** — just send an email |
| **API quality** ★★★☆☆ — Use any SMTP library (Python `smtplib`, Node `nodemailer`) |
| **Inbound + Outbound** | ✅ Outbound via email; Inbound requires webhook setup |
| **US/International** | 🇺🇸 US carriers only |
| **Reliability** | ★★★☆☆ — Works but carriers may throttle, block, or change gateways without notice. 160-char limit. |
| **Ease of integration** | ★★★★☆ — Standard SMTP, well-documented |

**Limitations:**
- Must know recipient's carrier to use correct gateway
- 160 character limit (no MMS support on most)
- Carriers increasingly blocking or rate-limiting
- Messages often show as from email address, not a phone number
- No delivery confirmation

**Verdict:** Good for prototyping. Unreliable for production CRM. Use as fallback.

---

## 4. Google Voice (Unofficial)

| Attribute | Details |
|-----------|---------|
| **Cost** | Free (personal Google account) |
| **API quality** | ★☆☆☆☆ — **No official API.** Unofficial options: |
| | - `pygooglevoice` (Python, frequently breaks) |
| | - Browser automation (Selenium/Playwright) — fragile |
| | - Google Voice only exposes API for Workspace accounts (paid) |
| **Inbound + Outbound** | ✅ Both, via unofficial means |
| **US/International** | 🇺🇸 US/Canada free; international varies |
| **Reliability** | ★☆☆☆☆ — Unofficial methods break with every Google update |
| **Ease of integration** | ★☆☆☆☆ — Extremely fragile, anti-bot measures |

**Verdict:** ❌ Not viable for autonomous AI agents. Too fragile.

---

## 5. Gammu + USB Modem (Self-Hosted)

| Attribute | Details |
|-----------|---------|
| **Cost** | ~$20-50 one-time for USB GSM modem + prepaid SIM |
| **Ongoing** | Prepaid SIM costs ($10-30/month for unlimited texting on MVNOs like Mint Mobile) |
| **API quality** | ★★★☆☆ — Gammu has CLI + Python bindings (`python-gammu`) |
| **Inbound + Outbound** | ✅ Both via AT commands |
| **US/International** | Depends on SIM card |
| **Reliability** | ★★★★☆ — Direct carrier connection, no third-party dependency |
| **Ease of integration** | ★★☆☆☆ — Requires hardware setup, USB modem driver config |

**Setup:**
```bash
# Install
sudo apt install gammu python3-gammu
# Configure modem
gammu-config
# Send SMS via Python
import gammu
sm = gammu.StateMachine()
sm.Init()
sm.SendSMS({'Text': 'Hello!', 'SMSC': {'Location': 1}, 'Number': '+15551234567'})
```

**Verdict:** Best for privacy/cost-conscious ops. Hardware dependency is the downside. Great if you have a spare Raspberry Pi.

---

## 6. Vonage (formerly Nexmo)

| Attribute | Details |
|-----------|---------|
| **Cost** | **Free trial: €2 credit** (~$2.20) |
| **Paid pricing** | ~$0.0068/SMS US outbound |
| **API quality** | ★★★★★ — Excellent REST API + SDKs |
| **Inbound + Outbound** | ✅ Both with webhooks |
| **US/International** | 🌍 200+ countries |
| **Reliability** | ★★★★★ |
| **Ease of integration** | ★★★★★ |

**Verdict:** Trial credit (~324 messages) is gone fast. Paid is comparable to Twilio. Not cost-effective for free tier.

---

## 7. MessageBird (now Bird)

| Attribute | Details |
|-----------|---------|
| **Cost** | Pay-as-you-go only (no free tier as of 2025) |
| **Paid pricing** | SMS rates vary by country; US ~$0.01-0.02/msg |
| **API quality** | ★★★★☆ |
| **Inbound + Outbound** | ✅ Both |
| **US/International** | 🌍 Global |
| **Reliability** | ★★★★☆ |
| **Ease of integration** | ★★★★☆ |

**Verdict:** No free tier. Not suitable for bootstrapping.

---

## 8. Plivo

| Attribute | Details |
|-----------|---------|
| **Cost** | Free trial with limited credits |
| **Paid pricing** | $0.0053/SMS US outbound (cheaper than Twilio) |
| **API quality** | ★★★★★ — Python, Node, Go, PHP, Java, .NET SDKs |
| **Inbound + Outbound** | ✅ Both with webhooks |
| **US/International** | 🌍 220+ countries |
| **Reliability** | ★★★★★ — 99.99% uptime |
| **Ease of integration** | ★★★★★ — "Integrate within 2 mins" |
| **Bonus** | Built-in Fraud Shield AI, 10DLC registration in 24hrs |

**Verdict:** Cheaper than Twilio at scale. Trial credits similar. Good long-term option but not free.

---

## 9. Newer / Notable Options (2025-2026)

### SignalWire
- **Free tier:** Generous trial credits
- **Pricing:** ~$0.0055/SMS (US)
- **API:** Twilio-compatible (drop-in replacement)
- **Verdict:** Good Twilio alternative, similar free trial limitations

### Telnyx
- **Free trial:** $15 credit on signup
- **Pricing:** ~$0.004/SMS (US) — significantly cheaper
- **API:** Excellent REST + SDKs
- **Verdict:** Best price-to-quality ratio for paid

### Bandwidth
- **Free trial:** Available
- **Pricing:** ~$0.0035/SMS (US) — cheapest major provider
- **API:** Good but more complex
- **Verdict:** Best for high volume, overkill for 50/day

---

## Comparison Matrix

| Provider | Free Tier | Cost/Msg (paid) | API Quality | Reliability | Best For |
|----------|-----------|-----------------|-------------|-------------|----------|
| **Textbelt (self-hosted)** | ∞ via email gateways | $0.04 (hosted) | ★★★★ | ★★★ | Free prototyping |
| **Email-to-SMS** | ∞ | $0 | ★★★ | ★★★ | Free prototyping |
| **Twilio** | ~$15 trial (verified only) | $0.011 | ★★★★★ | ★★★★★ | Production |
| **Plivo** | Trial credits | $0.0053 | ★★★★★ | ★★★★★ | Production (cheaper) |
| **Telnyx** | $15 trial | $0.004 | ★★★★ | ★★★★ | Production (cheapest) |
| **Vonage** | €2 trial | $0.007 | ★★★★★ | ★★★★★ | Global |
| **Gammu+Modem** | Hardware cost only | ~$0 (prepaid) | ★★★ | ★★★★ | Privacy/sovereignty |
| **Google Voice** | Free | $0 | ★ | ★ | ❌ Not viable |

---

## 🏆 Recommendation

### For Bootstrapping (Phase 1 — Free):

**Use Textbelt self-hosted + Email-to-SMS gateways**

```python
# Simple CRM SMS sender using email gateways
import smtplib

CARRIER_GATEWAYS = {
    "tmobile": "@tmomail.net",
    "verizon": "@vtext.com",
    "att": "@txt.att.net",
    "sprint": "@messaging.sprintpcs.com",
    "google_fi": "@msg.fi.google.com",
}

def send_sms(phone: str, carrier: str, message: str):
    gateway = CARRIER_GATEWAYS[carrier]
    to_addr = f"{phone}{gateway}"
    # Use your SMTP server (Gmail app password, etc.)
    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    server.login("your@gmail.com", "app_password")
    server.sendmail("your@gmail.com", to_addr, message)
    server.quit()
```

- **Cost:** $0/month
- **Limitation:** Must know carrier, 160 chars, less reliable
- **CRM requirement:** Store carrier field per contact

### For Production (Phase 2 — Cheap):

**Use Telnyx or Plivo** — both under $0.006/msg

- 50 msgs/day = ~$9/month
- Proper API with delivery receipts
- Dedicated phone number
- Inbound webhook support
- No carrier knowledge needed

### For Full Sovereignty (Alternative):

**Gammu + Raspberry Pi + prepaid SIM**

- One-time $50 hardware
- $15/month Mint Mobile unlimited
- No API dependency
- Full control

---

## Next Steps

1. **Immediate:** Implement email-to-SMS gateway in CRM backend
2. **Add carrier field** to contact model (or use carrier lookup API)
3. **Prototype with Textbelt** free tier (1/day) for testing
4. **Upgrade to Telnyx/Plivo** when revenue justifies $10/month
5. Consider Gammu setup for always-on agent communication
