const getDistricts = (req, res) => {
    try {
        // List of all 77 districts in Nepal
        const districts = [
            'Achham', 'Arghakhanchi', 'Baglung', 'Baitadi', 'Bajhang',
            'Bajura', 'Banke', 'Bara', 'Bardiya', 'Bhaktapur',
            'Bhojpur', 'Chitwan', 'Dadeldhura', 'Dailekh', 'Dang',
            'Darchula', 'Dhading', 'Dhankuta', 'Dhanusha', 'Dolakha',
            'Dolpa', 'Doti', 'Gorkha', 'Gulmi', 'Humla',
            'Ilam', 'Jajarkot', 'Jhapa', 'Jumla', 'Kailali',
            'Kalikot', 'Kanchanpur', 'Kapilvastu', 'Kaski', 'Kathmandu',
            'Kavrepalanchok', 'Khotang', 'Lalitpur', 'Lamjung', 'Mahottari',
            'Makwanpur', 'Manang', 'Morang', 'Mugu', 'Mustang',
            'Myagdi', 'Nawalparasi East', 'Nawalparasi West', 'Nuwakot', 'Okhaldhunga',
            'Palpa', 'Panchthar', 'Parbat', 'Parsa', 'Pyuthan',
            'Ramechhap', 'Rasuwa', 'Rautahat', 'Rolpa', 'Rukum East',
            'Rukum West', 'Rupandehi', 'Salyan', 'Sankhuwasabha', 'Saptari',
            'Sarlahi', 'Sindhuli', 'Sindhupalchok', 'Siraha', 'Solukhumbu',
            'Sunsari', 'Surkhet', 'Syangja', 'Tanahu', 'Taplejung',
            'Terhathum', 'Udayapur'
        ];
        res.json({
            success: true,
            data: districts,
            message: 'Districts retrieved successfully'
        });
    }
    catch (error) {
        console.error('Error in getDistricts:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Failed to retrieve districts'
            }
        });
    }
};
export { getDistricts };
//# sourceMappingURL=districtController.js.map