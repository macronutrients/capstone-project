#include <iostream>
#include <string.h>

class Pet
{
    public:

    Pet();

    Pet(std::string name = "", int star_unlock = 0);

    std::string getName();

    int getStarUnlock();

    private:
    std::string name_;
    int star_unlock_;
};