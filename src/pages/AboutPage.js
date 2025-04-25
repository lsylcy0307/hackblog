import React from 'react';
import styled from 'styled-components';
import Layout from '../components/layout/Layout';
import theme from '../utils/theme';

const AboutContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: ${theme.spacing.lg};
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60%;
    height: 4px;
    background-color: ${theme.colors.primary};
    border-radius: 2px;
  }
`;

const Section = styled.section`
  margin-bottom: ${theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: ${theme.spacing.md};
  color: ${theme.colors.text};
`;

const Paragraph = styled.p`
  margin-bottom: ${theme.spacing.md};
  line-height: 1.7;
  color: ${theme.colors.text};
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${theme.spacing.lg};
  margin-top: ${theme.spacing.lg};
`;

const TeamMember = styled.div`
  text-align: center;
`;

const MemberImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-image: url(${props => props.src || '/default-profile.jpg'});
  background-size: cover;
  background-position: center;
  margin: 0 auto ${theme.spacing.sm};
`;

const MemberName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: ${theme.spacing.xs};
`;

const MemberRole = styled.p`
  font-size: 0.9rem;
  color: ${theme.colors.lightText};
  margin-bottom: ${theme.spacing.xs};
`;

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Jane Doe',
      role: 'Editor-in-Chief',
      image: 'https://i.pravatar.cc/300?img=1'
    },
    {
      name: 'John Smith',
      role: 'Tech Lead',
      image: 'https://i.pravatar.cc/300?img=2'
    },
    {
      name: 'Sarah Johnson',
      role: 'Content Manager',
      image: 'https://i.pravatar.cc/300?img=3'
    },
    {
      name: 'Michael Brown',
      role: 'Developer',
      image: 'https://i.pravatar.cc/300?img=4'
    }
  ];

  return (
    <Layout>
      <AboutContainer>
        <PageTitle>About Us</PageTitle>
        
        <Section>
          <SectionTitle>Our Mission</SectionTitle>
          <Paragraph>
            The Hack4Impact Engineering Blog is a platform for our community to share technical insights, project learnings, and the impact of our work with nonprofits. We believe in the power of technology to create positive social change, and we're committed to documenting and sharing our journey.
          </Paragraph>
          <Paragraph>
            Our blog serves as both a knowledge repository for our members and a resource for the broader tech community interested in using their skills for social good.
          </Paragraph>
        </Section>
        
        <Section>
          <SectionTitle>What We Write About</SectionTitle>
          <Paragraph>
            Our content spans several categories:
          </Paragraph>
          <ul>
            <li><strong>Engineering</strong>: Technical deep dives, code walkthroughs, and best practices</li>
            <li><strong>Products</strong>: Case studies of applications we've built and product development insights</li>
            <li><strong>Impact</strong>: Stories about the real-world effect of our technical solutions</li>
            <li><strong>Nonprofits</strong>: Insights about working with nonprofit organizations and building tech for social good</li>
          </ul>
        </Section>
        
        <Section>
          <SectionTitle>Our Team</SectionTitle>
          <Paragraph>
            Our blog is maintained by a dedicated team of student volunteers who are passionate about both technology and social impact.
          </Paragraph>
          
          <TeamGrid>
            {teamMembers.map((member, index) => (
              <TeamMember key={index}>
                <MemberImage src={member.image} />
                <MemberName>{member.name}</MemberName>
                <MemberRole>{member.role}</MemberRole>
              </TeamMember>
            ))}
          </TeamGrid>
        </Section>
        
        <Section>
          <SectionTitle>Get Involved</SectionTitle>
          <Paragraph>
            We welcome contributions from all members of Hack4Impact and the broader tech-for-good community. If you have insights, tutorials, or stories to share, please reach out to our editorial team.
          </Paragraph>
          <Paragraph>
            As a reader, we encourage you to engage with our content through comments, social media sharing, and applying the knowledge in your own projects.
          </Paragraph>
        </Section>
      </AboutContainer>
    </Layout>
  );
};

export default AboutPage; 