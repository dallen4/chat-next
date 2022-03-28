import About from 'layouts/About';
import { AboutProps } from 'layouts/About/About';
import { GetStaticProps } from 'next';

const dependencies = require('../../package.json').dependencies;
const libraryNames = Object.keys(dependencies);

export const getStaticProps: GetStaticProps<AboutProps> = async () => {
    return {
        props: {
            libraries: libraryNames,
        },
    };
};

export default About;
