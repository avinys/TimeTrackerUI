import styles from "../styles/legal.module.css";

const CONTROLLER_NAME = "Arvydas Vingis";
const CONTACT_EMAIL = "boss@arvydasvingis.com";
const LOCATION = "Lithuania";
const HOSTING = "Hetzner (eu-central)";
const EMAIL_PROVIDER = "Zoho SMTP (smtp.zoho.eu)";
const CONTACT_RETENTION = "12 months";
const LOG_RETENTION = "30 days";
const LAST_UPDATED = "11 September 2025";

export default function PrivacyPolicyPage() {
	return (
		<div className={styles.wrap}>
			<article className={styles.paper}>
				<header className={styles.header}>
					<h1 className={styles.title}>Privacy Policy</h1>
					<p className={styles.kicker}>Last updated: {LAST_UPDATED}</p>
				</header>

				<div className={styles.meta}>
					<div>
						<b>Controller:</b> {CONTROLLER_NAME} (“we”, “us”).
					</div>
					<div>
						<b>Contact:</b> <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
					</div>
					<div>
						<b>Location:</b> {LOCATION}
					</div>
				</div>

				<section className={styles.section}>
					<h2>What we collect</h2>
					<ul className={styles.list}>
						<li>
							<b>Account data:</b> email (to register, sign in, confirm, and reset
							passwords).
						</li>
						<li>
							<b>Contact form data:</b> name, email, message, optional phone.
						</li>
						<li>
							<b>Technical logs:</b> IP address, user-agent, and basic request
							metadata for security/troubleshooting.
						</li>
						<li>
							<b>Cookies/trackers:</b> We <em>do not</em> use non-essential cookies or
							ad/behavioral trackerstyles.
						</li>
					</ul>
				</section>

				<section className={styles.section}>
					<h2>Why we process your data (GDPR legal bases)</h2>
					<ul className={styles.list}>
						<li>
							<b>Provide and secure the site &amp; respond to messages</b> —
							legitimate interests (Art. 6(1)(f)).
						</li>
						<li>
							<b>Create and maintain your account</b> — contract/performance (Art.
							6(1)(b)).
						</li>
						<li>
							If we ever add non-essential analytics, we will ask for <b>consent</b>{" "}
							first (Art. 6(1)(a)).
						</li>
					</ul>
				</section>

				<section className={styles.section}>
					<h2>How we protect your data</h2>
					<ul className={styles.list}>
						<li>
							Transport encrypted via <b>TLS</b>.
						</li>
						<li>
							Passwords hashed with <b>BCrypt</b>.
						</li>
						<li>
							One-time tokens (email confirmation / password reset) stored as{" "}
							<b>SHA-256 hashes</b> with short expiry.
						</li>
						<li>Access restricted to what’s necessary for operationstyles.</li>
					</ul>
				</section>

				<section className={styles.section}>
					<h2>How long we keep data</h2>
					<ul className={styles.list}>
						<li>
							<b>Accounts:</b> kept while your account is active or until you request
							deletion.
						</li>
						<li>
							<b>Contact messages:</b> up to <b>{CONTACT_RETENTION}</b>.
						</li>
						<li>
							<b>Server logs:</b> up to <b>{LOG_RETENTION}</b>.
						</li>
						<li>Backups follow our hosting provider’s standard retention.</li>
					</ul>
				</section>

				<section className={styles.section}>
					<h2>Where and with whom we process</h2>
					<ul className={styles.list}>
						<li>
							<b>Hosting:</b> {HOSTING}.
						</li>
						<li>
							<b>Email delivery:</b> {EMAIL_PROVIDER}.
						</li>
						<li>
							<b>Fonts:</b> Self-hosted Inter via{" "}
							<span className={styles.code}>@fontsource-variable/inter</span>; no
							third-party font requests.
						</li>
					</ul>
					<p>
						We don’t sell your data. These providers act as processors under our
						instructionstyles.
					</p>
				</section>

				<section className={styles.section}>
					<h2>International transfers</h2>
					<p>
						Hosting and email are located in the EU. We do not load fonts from
						third-party CDNs; fonts are self-hosted.
					</p>
				</section>

				<section className={styles.section}>
					<h2>Your rights (GDPR)</h2>
					<p>
						You can request access, correction, deletion, restriction, or portability,
						and object to certain processing. Contact{" "}
						<a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. You may also lodge
						a complaint with your local supervisory authority (e.g., the State Data
						Protection Inspectorate of Lithuania).
					</p>
				</section>

				<section className={styles.section}>
					<h2>Children</h2>
					<p>
						This site is not intended for children under 16. We do not knowingly collect
						their data.
					</p>
				</section>

				<section className={styles.section}>
					<h2>Changes</h2>
					<p>We may update this policy; we’ll post the new date at the top.</p>
				</section>
			</article>
		</div>
	);
}
