import styles from "../styles/legal.module.css";

const OWNER_NAME = "Arvydas Vingis";
const LAST_UPDATED = "11 September 2025";
const CONTACT_EMAIL = "boss@arvydasvingis.com";
const GOVERNING_LAW = "Lithuania";

export default function TermsOfUsePage() {
	return (
		<div className={styles.wrap}>
			<article className={styles.paper}>
				<header className={styles.header}>
					<h1 className={styles.title}>Terms of Use</h1>
					<p className={styles.kicker}>Last updated: {LAST_UPDATED}</p>
				</header>

				<section className={styles.section}>
					<p>
						Welcome to this portfolio website operated by <b>{OWNER_NAME}</b> (“we”,
						“us”). By using the Site, you agree to these Termstyles.
					</p>
				</section>

				<section className={styles.section}>
					<h2>Use of the Site</h2>
					<p>
						Use the Site lawfully and do not attempt to disrupt, reverse engineer, or
						gain unauthorized accesstyles.
					</p>
				</section>

				<section className={styles.section}>
					<h2>Accounts</h2>
					<p>
						You are responsible for safeguarding your credentials and for activity under
						your account.
					</p>
				</section>

				<section className={styles.section}>
					<h2>Intellectual Property</h2>
					<p>
						Unless otherwise noted, content on the Site (text, screenshots, designs, and
						code snippets) is owned by us or used with permission. Do not copy or
						redistribute except where a project clearly provides an open-source license.
					</p>
				</section>

				<section className={styles.section}>
					<h2>Third-Party Links</h2>
					<p>We are not responsible for external sites or their content.</p>
				</section>

				<section className={styles.section}>
					<h2>No Warranties</h2>
					<p>
						The Site is provided “as is” without warranties of any kind, including
						availability, accuracy, or fitness for a particular purpose.
					</p>
				</section>

				<section className={styles.section}>
					<h2>Limitation of Liability</h2>
					<p>
						To the maximum extent permitted by law, we are not liable for indirect,
						incidental, or consequential damages arising from use of the Site.
					</p>
				</section>

				<section className={styles.section}>
					<h2>Governing Law</h2>
					<p>
						These Terms are governed by the laws of <b>{GOVERNING_LAW}</b>.
					</p>
				</section>

				<section className={styles.section}>
					<h2>Changes</h2>
					<p>We may update these Terms; we’ll post the new date at the top.</p>
				</section>

				<section className={styles.section}>
					<h2>Contact</h2>
					<p>
						Questions? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
					</p>
				</section>
			</article>
		</div>
	);
}
