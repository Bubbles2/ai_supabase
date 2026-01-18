const supabase = require('./supabaseClient');

const saveUpload = async (filename, description = '') => {
    const { data, error } = await supabase
        .from('uploads')
        .insert([
            { filename, description }
        ])
        .select();

    if (error) {
        console.error('Error saving upload:', error);
        throw error;
    }
    return data;
};

const getUploads = async () => {
    const { data, error } = await supabase
        .from('uploads')
        .select('*')
        .order('date_uploaded', { ascending: false });

    if (error) {
        console.error('Error fetching uploads:', error);
        throw error;
    }
    return data;
};

module.exports = { saveUpload, getUploads };
