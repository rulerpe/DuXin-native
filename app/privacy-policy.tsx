import { ScrollView, StyleSheet, Text, TouchableOpacity, Linking } from 'react-native';

const PrivacyPolicyPage = () => {
  return (
    <ScrollView
      style={styles.privacyPolicyPageWrapper}
      contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Privacy Policy for Duxin</Text>
      <Text style={styles.effectiveDate}>Effective Date: March 18, 2024</Text>

      <Text style={styles.paragraph}>
        I, Jun Chen, the creator of Duxin, respect the privacy of its users ("you" or "your"). This
        Privacy Policy explains how I collect, use, disclose, and safeguard your information when
        you use the Duxin application. Please read this Privacy Policy carefully. If you do not
        agree with the terms of this Privacy Policy, please do not access the application.
      </Text>

      <Text style={styles.heading}>1. Collection of Your Information</Text>
      <Text style={styles.paragraph}>
        We may collect information about you in various ways. The information we may collect via the
        Application includes:
      </Text>

      <Text style={styles.listItem}>
        • <Text style={styles.bold}>Personal Data:</Text> When signing up and using our services,
        you voluntarily give us certain personal information, including your phone number.
      </Text>
      <Text style={styles.listItem}>
        • <Text style={styles.bold}>Images of Mail Letters:</Text> The app asks you to take pictures
        of your mail letters for summarization and translation. These images are processed and
        stored.
      </Text>
      <Text style={styles.listItem}>
        • <Text style={styles.bold}>Summaries and Translations:</Text> We generate summaries and
        translations of your mail letters, which are stored to provide you with historical access.
      </Text>

      <Text style={styles.heading}>2. Use of Your Information</Text>
      <Text style={styles.paragraph}>
        Having accurate information about you permits me to provide you with a smooth, efficient,
        and customized experience. Specifically, I may use information collected about you via the
        Application to:
      </Text>

      <Text style={styles.listItem}>
        • Facilitate account creation and authentication through phone number OTP.
      </Text>
      <Text style={styles.listItem}>
        • Store images of your mail letters and the corresponding summaries and translations.
      </Text>
      <Text style={styles.listItem}>
        • Offer personalized summaries and translations of your mail letters.
      </Text>
      <Text style={styles.listItem}>
        • Increase the efficiency and operation of the Application.
      </Text>

      <Text style={styles.heading}>3. Your information may be disclosed as follows:</Text>

      <Text style={styles.listItem}>
        • By Law or to Protect Rights: If I believe the release of information about you is
        necessary to respond to legal process, to investigate or remedy potential violations of our
        policies, or to protect the rights, property, and safety of others, I may share your
        information as permitted or required by any applicable law, rule, or regulation.
      </Text>
      <Text style={styles.listItem}>
        • Third-Party Service Providers: I may share your information with third parties that
        perform services for me in relation to the Application, including data analysis, email
        delivery, hosting services, customer service, and marketing assistance.
      </Text>

      <Text style={styles.heading}>4. Data Storage</Text>
      <Text style={styles.paragraph}>
        Your information is stored on Firebase, a platform developed by Google, which provides me
        with the tools and infrastructure to safely store your data, including images and text
        summaries.
      </Text>

      <Text style={styles.heading}>5. Security of Your Information</Text>
      <Text style={styles.paragraph}>
        I use administrative, technical, and physical security measures to help protect your
        personal information. While I have taken reasonable steps to secure the personal information
        you provide to me, please be aware that despite my efforts, no security measures are perfect
        or impenetrable, and no method of data transmission can be guaranteed against any
        interception or other type of misuse.
      </Text>
      <Text style={styles.heading}>6. Policy for Children</Text>
      <Text style={styles.paragraph}>
        I do not knowingly solicit information from or market to children under the age of 13. If I
        learn that personal information from users less than 13 years of age has been collected, I
        will deactivate the account and take reasonable measures to promptly delete such data from
        our records.
      </Text>

      <Text style={styles.heading}>Contact Us</Text>
      <Text style={styles.paragraph}>
        If you have questions or comments about this Privacy Policy, please contact us at:
      </Text>
      <TouchableOpacity onPress={() => Linking.openURL('mailto:postsorter2024@gmail.com')}>
        <Text style={styles.emailText}>postsorter2024@gmail.com</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PrivacyPolicyPage;

const styles = StyleSheet.create({
  privacyPolicyPageWrapper: {
    paddingHorizontal: 15,
    width: '100%',
  },
  contentContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  effectiveDate: {
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 10,
    marginLeft: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  emailText: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
    paddingBottom: 20,
  },
});
