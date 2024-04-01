import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';
import { Link, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
const SupportPage = () => {
  const { t, i18n } = useTranslation();
  return (
    <ScrollView
      style={styles.privacyPolicyPageWrapper}
      contentContainerStyle={styles.contentContainer}>
      <Text style={styles.heading}>Support</Text>
      <Text style={styles.description}>
        Having trouble using Duxin? We're here to help! Check out the resources below or reach out
        to our team.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionHeading}>FAQs</Text>
        <View style={styles.faqContainer}>
          <Text style={styles.faqQuestion}>How do I scan a document to translate?</Text>
          <Text style={styles.faqAnswer}>
            Simply open the Duxin app and tap the "Take a picture" button. Position the document you
            want to translate inside the viewfinder and capture the document, the app will
            automatically process the image.
          </Text>
        </View>

        <View style={styles.faqContainer}>
          <Text style={styles.faqQuestion}>What languages does Duxin support?</Text>
          <Text style={styles.faqAnswer}>
            Duxin currently supports translation between "English", "Chinese", "Spanish", "French",
            "Korean", "Russian", "Vietnamese", "Filipino".
          </Text>
        </View>

        <View style={styles.faqContainer}>
          <Text style={styles.faqQuestion}>How do I view previous translations?</Text>
          <Text style={styles.faqAnswer}>
            Tap the "Account" button on the top right, login to see a list of your past translated
            documents. You can view or delete them from here.
          </Text>
        </View>

        {/* <View style={styles.faqContainer}>
          <Text style={styles.faqQuestion}>Is my data kept private?</Text>
          <Text style={styles.faqAnswer}>
            Yes, all document images and translations processed in Duxin stay securely on your
            device and are not transmitted to any servers.
          </Text>
        </View> */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Get Help</Text>
        <Text style={styles.text}>Still need assistance? Our support team is happy to help!</Text>
        <TouchableOpacity onPress={() => Linking.openURL('mailto:postsorter2024@gmail.com')}>
          <Text style={styles.emailText}>postsorter2024@gmail.com</Text>
        </TouchableOpacity>
        <Text style={styles.text}>
          You can also get in touch through the in-app feedback option under Settings. We try to
          respond within 24 hours.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Privacy Policy</Text>
        <Link style={styles.link} href="/privacy-policy">
          <Text>{t('privacyPolicyLink')}</Text>
        </Link>
      </View>
    </ScrollView>
  );
};

export default SupportPage;

const styles = StyleSheet.create({
  privacyPolicyPageWrapper: {
    paddingHorizontal: 15,
    width: '100%',
  },
  contentContainer: {
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  emailText: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
    paddingBottom: 20,
  },
  faqContainer: {
    marginBottom: 16,
  },
  faqQuestion: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  faqAnswer: {
    marginBottom: 8,
  },
});
